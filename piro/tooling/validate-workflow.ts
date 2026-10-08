/**
 * Deterministic structural validator for the `piro/` artifact chain.
 *
 *   npm run validate:workflow
 *
 * Checks the folder taxonomy, PID/spec placement, issue traceability,
 * duplicate artifact IDs, that `piro/workflow.yaml` (the
 * machine-readable control plane) only points at files that actually exist,
 * that every run's `workflow-progress.yaml` is internally consistent, and
 * that the committed `piro/dashboard/index.html` is fresh.
 * See `.github/copilot-instructions.md` for the canonical folder shape this
 * script enforces, and the `piro-workflow-steward` agent's audit mode
 * (`.github/agents/piro-workflow-steward.agent.md`) for the human-in-the-
 * loop repair workflow this backs.
 *
 * Exits non-zero on any violation so it can gate CI. Progress-graph warnings
 * (suspicious drift) are printed but do not fail.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { dashboardFreshnessError, readWorkflowDoc, validateWorkflowProgress } from "./workflow-progress";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const WORKFLOW_DIR = join(ROOT, "piro");
const RUNS_DIR = join(WORKFLOW_DIR, "runs");
const RUNS_INDEX = join(WORKFLOW_DIR, "runs-index.md");
const WORKFLOW_YAML = join(WORKFLOW_DIR, "workflow.yaml");

const ALLOWED_RUN_SUBDIRS = new Set(["00-context", "01-plan", "02-implement", "03-review", "04-ops"]);
const ALLOWED_PLAN_SUBDIRS = new Set(["01-research-intent", "02-planning", "03-solutioning"]);
const ALLOWED_SOLUTIONING_SUBDIRS = new Set(["specs", "design", "decisions", "diagrams", "issues"]);
const ALLOWED_IMPLEMENT_SUBDIRS = new Set(["issues", "implementation-notes", "implementation-plan", "migrations"]);
const ALLOWED_REVIEW_SUBDIRS = new Set(["reviews", "test-results", "security", "retrospectives"]);
const ALLOWED_OPS_SUBDIRS = new Set(["runbooks", "releases", "monitoring", "incidents", "known-issues"]);
const DONE_STATUSES = new Set(["done", "complete", "completed", "closed"]);

type Category = { label: string; violations: string[] };
type WorkflowYamlDoc = { runs?: { id: string }[] };
type IssueGraphDoc = { issues?: { id: string; title?: string; file?: string }[] };

function rel(p: string): string {
  return relative(ROOT, p);
}

function listDirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name);
}

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function checkUnexpectedSubdirs(dir: string, allowed: Set<string>, violations: string[]) {
  for (const name of listDirs(dir)) {
    if (!allowed.has(name)) violations.push(`${rel(join(dir, name))} is not a recognized folder in this location`);
  }
}

// --- discover runs from the three sources of truth ---

function runsFromIndex(): Set<string> {
  const text = existsSync(RUNS_INDEX) ? readFileSync(RUNS_INDEX, "utf8") : "";
  const ids = new Set<string>();
  for (const m of text.matchAll(/runs\/([A-Za-z0-9._-]+)\//g)) ids.add(m[1]);
  return ids;
}

function runsFromDisk(): Set<string> {
  return new Set(listDirs(RUNS_DIR));
}

function runsFromWorkflowYaml(): { ids: Set<string>; doc: WorkflowYamlDoc | null } {
  const ids = new Set<string>();
  if (!existsSync(WORKFLOW_YAML)) return { ids, doc: null };
  const doc = parseYaml(readFileSync(WORKFLOW_YAML, "utf8")) as WorkflowYamlDoc;
  for (const run of doc?.runs ?? []) ids.add(run.id);
  return { ids, doc };
}

// --- checks ---

function checkRunIndexConsistency(): Category {
  const violations: string[] = [];
  const index = runsFromIndex();
  const disk = runsFromDisk();
  const { ids: yamlIds, doc } = runsFromWorkflowYaml();

  if (!doc) violations.push("piro/workflow.yaml is missing");

  for (const id of disk) {
    if (!index.has(id)) violations.push(`${id} exists under piro/runs/ but is not referenced in runs-index.md`);
    if (doc && !yamlIds.has(id)) violations.push(`${id} exists under piro/runs/ but has no entry in workflow.yaml`);
  }
  for (const id of index) {
    if (!disk.has(id)) violations.push(`runs-index.md references ${id}, but piro/runs/${id} does not exist`);
  }
  if (doc) {
    for (const id of yamlIds) {
      if (!disk.has(id)) violations.push(`workflow.yaml references ${id}, but piro/runs/${id} does not exist`);
    }
  }
  return { label: "Run index consistency", violations };
}

function checkPlanStructure(runDir: string, runId: string): string[] {
  const violations: string[] = [];
  const planDir = join(runDir, "01-plan");
  if (!existsSync(planDir)) return violations;
  checkUnexpectedSubdirs(planDir, ALLOWED_PLAN_SUBDIRS, violations);

  const solutioningDir = join(planDir, "03-solutioning");
  if (existsSync(solutioningDir)) checkUnexpectedSubdirs(solutioningDir, ALLOWED_SOLUTIONING_SUBDIRS, violations);

  // Every pid-*.md anywhere in the run must live under 01-plan/02-planning/.
  const planningDir = join(planDir, "02-planning");
  for (const file of walkFiles(planDir)) {
    if (/^pid-.*\.md$/i.test(file.split("/").pop()!) && dirname(file) !== planningDir) {
      violations.push(`${rel(file)} is a PID file outside 01-plan/02-planning/`);
    }
  }
  // Every SPEC.md must live under 01-plan/03-solutioning/specs/<slug>/.
  const specsDir = join(solutioningDir, "specs");
  for (const file of walkFiles(planDir)) {
    if (file.endsWith("/SPEC.md") && dirname(dirname(file)) !== specsDir) {
      violations.push(`${rel(file)} is a SPEC.md outside 01-plan/03-solutioning/specs/<slug>/`);
    }
  }
  return violations;
}

function extractField(text: string, label: string): string | null {
  const m = text.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`));
  return m ? m[1].trim() : null;
}

function checkIssueTraceability(runDir: string): string[] {
  const violations: string[] = [];
  const issuesDir = join(runDir, "02-implement", "issues");
  const reviewsDir = join(runDir, "03-review", "reviews");
  if (!existsSync(issuesDir)) return violations;

  for (const name of listFiles(issuesDir)) {
    if (!name.endsWith(".md") || name === "decomposition.md" || name === "kanban.md") continue;
    const file = join(issuesDir, name);
    const text = readFileSync(file, "utf8");

    const sourcePid = extractField(text, "Source PID");
    const canonicalSpec = extractField(text, "Canonical spec");
    if (!sourcePid && !canonicalSpec) {
      violations.push(`${rel(file)} has no Source PID or Canonical spec reference`);
    }
    for (const field of [sourcePid, canonicalSpec]) {
      const linkMatch = field?.match(/\(([^)]+\.md)\)/);
      if (linkMatch) {
        const target = join(issuesDir, linkMatch[1]);
        if (!existsSync(target)) violations.push(`${rel(file)} references missing file ${linkMatch[1]}`);
      }
    }

    const status = extractField(text, "Status")?.toLowerCase();
    const idMatch = name.match(/^([a-z]+-\d+)-/i);
    if (status && DONE_STATUSES.has(status) && idMatch) {
      const id = idMatch[1].toUpperCase();
      const reviewFiles = listFiles(reviewsDir);
      const hasReview = reviewFiles.some((f) => f.toUpperCase().includes(id) || readFileSync(join(reviewsDir, f), "utf8").toUpperCase().includes(id));
      if (!hasReview) violations.push(`${id} is marked ${status} but has no matching artifact in 03-review/reviews/`);
    }
  }
  return violations;
}

function checkDuplicateIds(runDir: string): string[] {
  const violations: string[] = [];

  const decisionsDir = join(runDir, "01-plan", "03-solutioning", "decisions");
  const seenAdr = new Map<string, string>();
  for (const name of listFiles(decisionsDir)) {
    const m = name.match(/^(ADR-\d+)/);
    if (!m) continue;
    if (seenAdr.has(m[1])) violations.push(`Duplicate ${m[1]}: ${seenAdr.get(m[1])} and ${name}`);
    else seenAdr.set(m[1], name);
  }

  const issuesDir = join(runDir, "02-implement", "issues");
  for (const name of listFiles(issuesDir)) {
    if (!name.endsWith("-issue-graph.yaml")) continue;
    const doc = parseYaml(readFileSync(join(issuesDir, name), "utf8")) as IssueGraphDoc;
    const seenIssue = new Map<string, string>();
    for (const issue of doc?.issues ?? []) {
      if (seenIssue.has(issue.id)) violations.push(`Duplicate issue id ${issue.id} in ${name}`);
      else seenIssue.set(issue.id, issue.title ?? issue.id);
      if (issue.file && !existsSync(join(ROOT, issue.file))) {
        violations.push(`${issue.id} in ${name} points at missing file ${issue.file}`);
      }
    }
  }
  return violations;
}

function checkNoArtifactsOutsideWorkflow(): Category {
  const violations: string[] = [];
  const suspiciousName = /^(prd|pid|spec|architecture|adr)[-_].*\.md$/i;
  const whitelist = new Set(["README.md", "AGENTS.md"]);

  for (const name of listFiles(ROOT)) {
    if (!name.endsWith(".md") || whitelist.has(name)) continue;
    if (suspiciousName.test(name)) violations.push(`${name} found outside piro/`);
  }

  for (const candidate of ["docs", "notes"]) {
    const dir = join(ROOT, candidate);
    if (!existsSync(dir)) continue;
    for (const file of walkFiles(dir)) {
      if (file.endsWith(".md")) violations.push(`${rel(file)} found outside piro/`);
    }
  }
  return { label: "No artifacts outside piro/", violations };
}

function checkWorkflowYamlIntegrity(): Category {
  const violations: string[] = [];
  if (!existsSync(WORKFLOW_YAML)) return { label: "workflow.yaml integrity", violations: ["piro/workflow.yaml is missing"] };

  const doc: unknown = parseYaml(readFileSync(WORKFLOW_YAML, "utf8"));

  function walk(value: unknown, path: string) {
    if (typeof value === "string") {
      if (/\.(md|yaml|yml)$/.test(value) && value.includes("/") && !value.startsWith("http")) {
        if (!existsSync(join(ROOT, value))) violations.push(`workflow.yaml:${path} points at missing file ${value}`);
      }
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}[${i}]`));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
    }
  }
  walk(doc, "");
  return { label: "workflow.yaml integrity", violations };
}

// --- run ---

function main() {
  const categories: Category[] = [];
  categories.push(checkRunIndexConsistency());

  const planViolations: string[] = [];
  const implementViolations: string[] = [];
  const reviewViolations: string[] = [];
  const opsViolations: string[] = [];
  const traceabilityViolations: string[] = [];
  const duplicateViolations: string[] = [];

  for (const runId of runsFromDisk()) {
    const runDir = join(RUNS_DIR, runId);
    checkUnexpectedSubdirs(runDir, ALLOWED_RUN_SUBDIRS, planViolations);
    planViolations.push(...checkPlanStructure(runDir, runId));
    checkUnexpectedSubdirs(join(runDir, "02-implement"), ALLOWED_IMPLEMENT_SUBDIRS, implementViolations);
    checkUnexpectedSubdirs(join(runDir, "03-review"), ALLOWED_REVIEW_SUBDIRS, reviewViolations);
    checkUnexpectedSubdirs(join(runDir, "04-ops"), ALLOWED_OPS_SUBDIRS, opsViolations);
    traceabilityViolations.push(...checkIssueTraceability(runDir));
    duplicateViolations.push(...checkDuplicateIds(runDir));
  }

  categories.push({ label: "Plan structure", violations: planViolations });
  categories.push({ label: "Implementation structure", violations: implementViolations });
  categories.push({ label: "Review structure", violations: reviewViolations });
  categories.push({ label: "Ops structure", violations: opsViolations });
  categories.push({ label: "Issue traceability", violations: traceabilityViolations });
  categories.push({ label: "Duplicate artifact IDs", violations: duplicateViolations });
  categories.push(checkNoArtifactsOutsideWorkflow());
  categories.push(checkWorkflowYamlIntegrity());

  let progressWarnings: string[] = [];
  try {
    const workflow = readWorkflowDoc();
    const progress = validateWorkflowProgress(workflow);
    progressWarnings = progress.warnings;
    categories.push({ label: "Workflow progress graphs", violations: progress.errors });
    const stale = progress.errors.length === 0 ? dashboardFreshnessError(workflow) : null;
    categories.push({ label: "Dashboard freshness", violations: stale ? [stale] : [] });
  } catch (error) {
    categories.push({
      label: "Workflow progress graphs",
      violations: [`could not read workflow progress: ${error instanceof Error ? error.message : String(error)}`],
    });
  }

  console.log("Workflow validation\n");
  let total = 0;
  for (const category of categories) {
    if (category.violations.length === 0) {
      console.log(`\u2713 ${category.label}`);
    } else {
      for (const v of category.violations) console.log(`\u2717 ${v}`);
      total += category.violations.length;
    }
  }
  if (progressWarnings.length > 0) {
    console.log("\nWarnings (status drift, not failing):");
    for (const warning of progressWarnings) console.log(`\u26a0 ${warning}`);
  }
  console.log(`\n${total} violation${total === 1 ? "" : "s"} found.`);
  process.exit(total > 0 ? 1 : 0);
}

main();
