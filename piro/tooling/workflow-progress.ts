/**
 * Shared model for per-run `workflow-progress.yaml` graphs.
 *
 * Used by `piro/tooling/validate-workflow.ts` (CI gate) and
 * `piro/tooling/workflow-dashboard.ts` (HTML generator). Contract:
 * `.agents/skills/piro-workflow-steward/references/workflow-model.md`.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const WORKFLOW_YAML_PATH = "piro/workflow.yaml";
export const DASHBOARD_HTML_PATH = "piro/dashboard/index.html";
export const DASHBOARD_HASH_INPUTS = [
  "piro/tooling/workflow-progress.ts",
  "piro/tooling/workflow-dashboard.ts",
  "piro/tooling/workflow-dashboard/client.js",
  "piro/tooling/workflow-dashboard/styles.css",
];

export const AREAS = ["plan", "implement", "review", "ops"] as const;
export const KINDS = ["artifact", "work_package", "human_gate", "review", "release"] as const;
export const PERSISTED_STATES = [
  "not_started",
  "in_progress",
  "awaiting_feedback",
  "changes_requested",
  "blocked",
  "done",
  "not_applicable",
] as const;
export const EVIDENCE_TYPES = [
  "canonical_artifact",
  "work_package",
  "source",
  "migration",
  "implementation_note",
  "decision",
  "review_result",
  "release_decision",
] as const;

export type Area = (typeof AREAS)[number];
export type NodeKind = (typeof KINDS)[number];
export type PersistedState = (typeof PERSISTED_STATES)[number];
export type DerivedState = PersistedState | "ready";
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export type ProgressEvidence = { type: EvidenceType; path: string; outcome?: string; label?: string };
export type ProgressPhase = { id: string; title: string; state: PersistedState; note?: string; updated_at?: string };
export type GithubIssueSnapshot = { url: string; state: "open" | "closed"; checked_at: string };

export type ProgressNode = {
  id: string;
  title: string;
  area: Area;
  stream: string;
  kind: NodeKind;
  state: PersistedState;
  updated_at: string;
  depends_on: string[];
  evidence: ProgressEvidence[];
  description?: string;
  phases?: ProgressPhase[];
  execution?: "AFK" | "HITL" | "MIXED";
  required?: boolean;
  priority?: number;
  producer?: string;
  local_only?: boolean;
  github_issue?: GithubIssueSnapshot;
  blocker?: string;
  feedback?: string;
  rationale?: string;
  supersedes?: string[];
  decision_ownership?: string[];
};

export type ProgressGraph = {
  version: number;
  run_id: string;
  updated: string;
  meta?: Record<string, unknown>;
  nodes: ProgressNode[];
};

export type WorkflowRun = {
  id: string;
  slug: string;
  phase: string;
  canonical: Record<string, string>;
  last_activity?: string;
  [key: string]: unknown;
};

export type WorkflowDoc = {
  version: number;
  updated: string;
  focus_run?: string;
  repository?: { slug?: string; default_branch?: string };
  runs: WorkflowRun[];
};

export type ValidationResult = { errors: string[]; warnings: string[] };
export type FileExists = (repoPath: string) => boolean;

export type DerivedNode = ProgressNode & {
  derived_state: DerivedState;
  critical_path_length: number;
  wave: number;
  dependents: string[];
};

export type DerivedRun = {
  id: string;
  slug: string;
  declared_phase: string;
  derived_phase: string;
  last_activity: string | null;
  updated: string;
  graph_path: string;
  next_action_id: string | null;
  parallel_ids: string[];
  warnings: string[];
  meta: Record<string, unknown>;
  nodes: DerivedNode[];
};

const ACCEPTED_REVIEW_OUTCOMES = new Set(["accepted", "approved", "passed"]);
const ACCEPTED_RELEASE_OUTCOMES = new Set(["approved", "go"]);
const ACTIVE_STATES = new Set<DerivedState>(["ready", "in_progress", "awaiting_feedback", "changes_requested", "blocked"]);
const NEXT_ACTION_RANK = new Map<DerivedState, number>([
  ["awaiting_feedback", 0],
  ["changes_requested", 1],
  ["in_progress", 2],
  ["ready", 3],
  ["blocked", 4],
]);

export const fsExists: FileExists = (repoPath) => existsSync(join(ROOT, repoPath));

export function readRepoFile(repoPath: string): string {
  return readFileSync(join(ROOT, repoPath), "utf8");
}

export function readWorkflowDoc(): WorkflowDoc {
  return parseYaml(readRepoFile(WORKFLOW_YAML_PATH)) as WorkflowDoc;
}

export function readGraph(graphPath: string): ProgressGraph {
  return parseYaml(readRepoFile(graphPath)) as ProgressGraph;
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isSatisfied(state: PersistedState | undefined): boolean {
  return state === "done" || state === "not_applicable";
}

function findCycle(nodes: ProgressNode[]): string[] | null {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(id: string, trail: string[]): string[] | null {
    if (visiting.has(id)) return [...trail.slice(trail.indexOf(id)), id];
    if (visited.has(id)) return null;
    visiting.add(id);
    for (const dependency of byId.get(id)?.depends_on ?? []) {
      if (!byId.has(dependency)) continue;
      const cycle = visit(dependency, [...trail, id]);
      if (cycle) return cycle;
    }
    visiting.delete(id);
    visited.add(id);
    return null;
  }

  for (const node of nodes) {
    const cycle = visit(node.id, []);
    if (cycle) return cycle;
  }
  return null;
}

function validateDoneEvidence(node: ProgressNode, prefix: string, errors: string[]) {
  const types = new Set(node.evidence.map((item) => item.type));

  switch (node.kind) {
    case "artifact":
      if (!types.has("canonical_artifact")) errors.push(`${prefix} is done but has no canonical_artifact evidence`);
      break;
    case "work_package":
      if (!types.has("work_package")) errors.push(`${prefix} is done but has no work_package evidence`);
      if (!types.has("source") && !types.has("migration") && !types.has("implementation_note")) {
        errors.push(`${prefix} is done but has no source, migration, or implementation_note evidence`);
      }
      break;
    case "human_gate":
      if (!types.has("decision")) errors.push(`${prefix} is done but has no decision evidence`);
      break;
    case "review": {
      const results = node.evidence.filter((item) => item.type === "review_result");
      if (results.length === 0) errors.push(`${prefix} is done but has no review_result evidence`);
      else if (!results.some((item) => ACCEPTED_REVIEW_OUTCOMES.has(item.outcome ?? ""))) {
        errors.push(`${prefix} is done but no review_result records an accepted/approved/passed outcome`);
      }
      break;
    }
    case "release": {
      const results = node.evidence.filter((item) => item.type === "release_decision");
      if (results.length === 0) errors.push(`${prefix} is done but has no release_decision evidence`);
      else if (!results.some((item) => ACCEPTED_RELEASE_OUTCOMES.has(item.outcome ?? ""))) {
        errors.push(`${prefix} is done but no release_decision records an approved/go outcome`);
      }
      break;
    }
  }

  if ((node.kind === "work_package" || node.kind === "human_gate") && !node.local_only) {
    const snapshot = node.github_issue;
    if (!snapshot) {
      errors.push(`${prefix} is done but has no stored GitHub issue snapshot (set local_only: true if untracked)`);
    } else if (snapshot.state !== "closed") {
      errors.push(`${prefix} is done but its stored GitHub issue snapshot is ${snapshot.state}`);
    }
  }
}

/** Validates one run's graph. Pure apart from the injected file-existence check. */
export function validateRunGraph(
  definition: WorkflowRun,
  graph: ProgressGraph,
  graphPath: string,
  exists: FileExists = fsExists,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const run = definition.id;

  if (graph?.version !== 1) errors.push(`${graphPath} has unsupported version ${String(graph?.version)}`);
  if (graph?.run_id !== run) errors.push(`${graphPath} run_id ${String(graph?.run_id)} does not match ${run}`);
  if (!isDate(graph?.updated)) errors.push(`${graphPath} has an invalid updated date`);
  if (!Array.isArray(graph?.nodes)) {
    errors.push(`${graphPath}: nodes must be an array`);
    return { errors, warnings };
  }

  const byId = new Map<string, ProgressNode>();
  for (const node of graph.nodes) {
    if (node?.id && byId.has(node.id)) errors.push(`${run} contains duplicate node id ${node.id}`);
    else if (node?.id) byId.set(node.id, node);
  }

  for (const node of graph.nodes) {
    const prefix = `${run}:${node?.id ?? "<missing-id>"}`;
    if (!node?.id || !node.title) errors.push(`${prefix} must have id and title`);
    if (!AREAS.includes(node.area)) errors.push(`${prefix} has invalid area ${String(node.area)}`);
    if (!KINDS.includes(node.kind)) errors.push(`${prefix} has invalid kind ${String(node.kind)}`);
    if (!PERSISTED_STATES.includes(node.state)) {
      errors.push(
        `${prefix} has invalid state ${String(node.state)}${String(node.state) === "ready" ? " (ready is derived; store not_started)" : ""}`,
      );
    }
    if (!node.stream) errors.push(`${prefix} must declare a stream`);
    if (!isDate(node.updated_at)) errors.push(`${prefix} has an invalid updated_at`);
    if (!Array.isArray(node.depends_on)) {
      errors.push(`${prefix}: depends_on must be an array`);
      node.depends_on = [];
    }
    if (!Array.isArray(node.evidence)) {
      errors.push(`${prefix}: evidence must be an array`);
      node.evidence = [];
    }

    for (const dependency of node.depends_on) {
      if (dependency === node.id) errors.push(`${prefix} cannot depend on itself`);
      else if (!byId.has(dependency)) errors.push(`${prefix} depends on unknown node ${dependency}`);
    }

    if (node.phases !== undefined) {
      if (!Array.isArray(node.phases)) errors.push(`${prefix}: phases must be an array`);
      else {
        const phaseIds = new Set<string>();
        for (const phase of node.phases) {
          if (!phase?.id || !phase.title) errors.push(`${prefix} has a phase without id and title`);
          else if (phaseIds.has(phase.id)) errors.push(`${prefix} has duplicate phase ${phase.id}`);
          else phaseIds.add(phase.id);
          if (!PERSISTED_STATES.includes(phase?.state)) errors.push(`${prefix} phase ${String(phase?.id)} has invalid state ${String(phase?.state)}`);
          if (phase?.updated_at !== undefined && !isDate(phase.updated_at)) errors.push(`${prefix} phase ${phase.id} has an invalid updated_at`);
        }
      }
    }

    for (const item of node.evidence) {
      if (!EVIDENCE_TYPES.includes(item?.type)) errors.push(`${prefix} has evidence with invalid type ${String(item?.type)}`);
      if (typeof item?.path !== "string" || /^https?:/.test(item.path)) {
        errors.push(`${prefix} evidence must be a workspace-relative file path, got ${String(item?.path)}`);
      } else if (!exists(item.path)) {
        errors.push(`${prefix} points at missing evidence ${item.path}`);
      }
    }

    const snapshot = node.github_issue;
    if (snapshot) {
      if (snapshot.state !== "open" && snapshot.state !== "closed") {
        errors.push(`${prefix} GitHub snapshot state must be open or closed`);
      }
      if (!isDate(snapshot.checked_at)) errors.push(`${prefix} GitHub snapshot has an invalid checked_at`);
      else if (isDate(node.updated_at) && Date.parse(snapshot.checked_at) < Date.parse(node.updated_at)) {
        errors.push(`${prefix} GitHub snapshot (checked ${snapshot.checked_at}) predates the node update ${node.updated_at}`);
      }
      if (node.state !== "done" && snapshot.state === "closed") {
        warnings.push(`${prefix} is ${node.state} locally but its GitHub snapshot is closed`);
      }
    }

    if (node.state === "done") {
      for (const dependencyId of node.depends_on) {
        const dependency = byId.get(dependencyId);
        if (dependency && !isSatisfied(dependency.state)) {
          errors.push(`${prefix} is done while dependency ${dependencyId} is ${dependency.state}`);
        }
      }
      validateDoneEvidence(node, prefix, errors);
    }

    if ((node.state === "awaiting_feedback" || node.state === "changes_requested") && !node.feedback) {
      warnings.push(`${prefix} is ${node.state} without a feedback note`);
    }
    if (node.state === "blocked" && !node.blocker) warnings.push(`${prefix} is blocked without a blocker note`);
    if (node.state === "not_applicable" && !node.rationale) warnings.push(`${prefix} is not_applicable without a rationale`);
  }

  const cycle = findCycle(graph.nodes);
  if (cycle) errors.push(`${run} has a dependency cycle: ${cycle.join(" -> ")}`);

  if (errors.length === 0) {
    const derived = deriveRun(definition, graph, graphPath);
    if (derived.derived_phase !== definition.phase) {
      warnings.push(`${run} declares phase ${definition.phase} but graph activity derives ${derived.derived_phase}`);
    }
  }
  if (definition.last_activity && isDate(graph.updated) && graph.updated > definition.last_activity) {
    warnings.push(`${run} progress graph (updated ${graph.updated}) is newer than workflow.yaml last_activity ${definition.last_activity}`);
  }

  return { errors, warnings };
}

/** Validates every run in workflow.yaml against its progress graph. */
export function validateWorkflowProgress(
  workflow: WorkflowDoc,
  loadGraph: (graphPath: string) => ProgressGraph = readGraph,
  exists: FileExists = fsExists,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (workflow?.version !== 1) errors.push(`workflow.yaml has unsupported version ${String(workflow?.version)}`);
  const runs = Array.isArray(workflow?.runs) ? workflow.runs : [];
  if (workflow?.focus_run && !runs.some((run) => run.id === workflow.focus_run)) {
    errors.push(`workflow.yaml focus_run ${workflow.focus_run} is not a known run`);
  }

  for (const definition of runs) {
    const graphPath = definition.canonical?.progress_graph;
    if (!graphPath) {
      errors.push(`${definition.id} has no canonical.progress_graph in workflow.yaml`);
      continue;
    }
    if (!definition.canonical.issue_graph) {
      errors.push(`${definition.id} has no backward-compatible canonical.issue_graph in workflow.yaml`);
    } else if (definition.canonical.issue_graph !== graphPath) {
      errors.push(`${definition.id} canonical.issue_graph must point at the unified progress graph ${graphPath}`);
    }
    if (!exists(graphPath)) {
      errors.push(`${definition.id} progress graph is missing: ${graphPath}`);
      continue;
    }

    let graph: ProgressGraph;
    try {
      graph = loadGraph(graphPath);
    } catch (error) {
      errors.push(`${graphPath} is not valid YAML: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    const result = validateRunGraph(definition, graph, graphPath, exists);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return { errors, warnings };
}

function computeWaves(nodes: ProgressNode[]): Map<string, number> {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const memo = new Map<string, number>();
  const wave = (id: string): number => {
    if (memo.has(id)) return memo.get(id)!;
    const node = byId.get(id)!;
    const sameArea = node.depends_on.filter((dep) => byId.get(dep)?.area === node.area);
    const value = sameArea.length ? 1 + Math.max(...sameArea.map(wave)) : 0;
    memo.set(id, value);
    return value;
  };
  nodes.forEach((node) => wave(node.id));
  return memo;
}

function computeCriticalPaths(nodes: ProgressNode[], dependents: Map<string, string[]>): Map<string, number> {
  const memo = new Map<string, number>();
  const length = (id: string): number => {
    if (memo.has(id)) return memo.get(id)!;
    const value = 1 + Math.max(0, ...(dependents.get(id) ?? []).map(length));
    memo.set(id, value);
    return value;
  };
  nodes.forEach((node) => length(node.id));
  return memo;
}

function derivePhase(nodes: DerivedNode[], declared: string): string {
  const active = nodes.filter((node) => ACTIVE_STATES.has(node.derived_state) && node.required !== false);
  const area = [...AREAS].reverse().find((candidate) => active.some((node) => node.area === candidate));
  if (area === "implement") return "IMPLEMENT";
  if (area === "review") return "REVIEW";
  if (area === "ops") return "OPS";
  if (area === "plan") {
    const streams = active.filter((node) => node.area === "plan").map((node) => node.stream);
    if (streams.some((stream) => stream.startsWith("solutioning"))) return "SOLUTIONING";
    if (streams.includes("planning")) return "PLANNING";
    return "RESEARCH";
  }
  return declared;
}

/** Derives readiness, layout waves, critical paths, current position and next action. Assumes a valid graph. */
export function deriveRun(
  definition: WorkflowRun,
  graph: ProgressGraph,
  graphPath: string,
  warnings: string[] = [],
): DerivedRun {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const dependents = new Map<string, string[]>();
  for (const node of graph.nodes) {
    for (const dependency of node.depends_on) dependents.set(dependency, [...(dependents.get(dependency) ?? []), node.id]);
  }
  const waves = computeWaves(graph.nodes);
  const paths = computeCriticalPaths(graph.nodes, dependents);

  const nodes: DerivedNode[] = graph.nodes.map((node) => ({
    ...node,
    derived_state:
      node.state === "not_started" && node.depends_on.every((id) => isSatisfied(byId.get(id)?.state)) ? "ready" : node.state,
    critical_path_length: paths.get(node.id) ?? 1,
    wave: waves.get(node.id) ?? 0,
    dependents: dependents.get(node.id) ?? [],
  }));

  const candidates = nodes
    .filter((node) => NEXT_ACTION_RANK.has(node.derived_state) && node.required !== false)
    .sort(
      (a, b) =>
        NEXT_ACTION_RANK.get(a.derived_state)! - NEXT_ACTION_RANK.get(b.derived_state)! ||
        (b.priority ?? 0) - (a.priority ?? 0) ||
        b.critical_path_length - a.critical_path_length ||
        a.id.localeCompare(b.id),
    );
  const next = candidates[0] ?? null;

  return {
    id: definition.id,
    slug: definition.slug,
    declared_phase: definition.phase,
    derived_phase: derivePhase(nodes, definition.phase),
    last_activity: definition.last_activity ?? null,
    updated: graph.updated,
    graph_path: graphPath,
    next_action_id: next?.id ?? null,
    parallel_ids: candidates
      .filter((node) => node.id !== next?.id && (node.derived_state === "ready" || node.derived_state === "in_progress"))
      .map((node) => node.id),
    warnings: warnings.filter((warning) => warning.startsWith(definition.id)),
    meta: graph.meta ?? {},
    nodes,
  };
}

/** Hash over every dashboard input so a stale committed HTML is detectable. */
export function computeDashboardSourceHash(workflow: WorkflowDoc, read: (repoPath: string) => string = readRepoFile): string {
  const files = [
    WORKFLOW_YAML_PATH,
    ...DASHBOARD_HASH_INPUTS,
    ...workflow.runs.map((run) => run.canonical?.progress_graph).filter((path): path is string => Boolean(path)),
  ].sort();
  const hash = createHash("sha256");
  for (const file of files) {
    let content: string;
    try {
      content = read(file).replace(/\r\n/g, "\n");
    } catch {
      content = "\u0000MISSING";
    }
    hash.update(`${file}\u0000${content}\u0000`);
  }
  return hash.digest("hex");
}

export function extractDashboardHash(html: string): string | null {
  return html.match(/<meta name="workflow-source-hash" content="([a-f0-9]{64})">/)?.[1] ?? null;
}

export function dashboardFreshnessError(workflow: WorkflowDoc): string | null {
  if (!fsExists(DASHBOARD_HTML_PATH)) return `${DASHBOARD_HTML_PATH} is missing; run npm run workflow:dashboard`;
  const actual = extractDashboardHash(readRepoFile(DASHBOARD_HTML_PATH));
  if (!actual) return `${DASHBOARD_HTML_PATH} has no workflow-source-hash; run npm run workflow:dashboard`;
  return actual === computeDashboardSourceHash(workflow)
    ? null
    : `${DASHBOARD_HTML_PATH} is stale relative to workflow.yaml/progress graphs; run npm run workflow:dashboard`;
}
