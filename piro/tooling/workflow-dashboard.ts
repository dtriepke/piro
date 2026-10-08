/**
 * Generates the self-contained workflow status dashboard.
 *
 *   npm run workflow:dashboard            # validate, then write piro/dashboard/index.html
 *   npm run workflow:dashboard -- --check # fail if the committed HTML is stale
 *
 * Output is deterministic (no wall-clock time), so regenerating without input
 * changes produces no diff. Contract:
 * `.agents/skills/piro-workflow-steward/references/workflow-model.md`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  DASHBOARD_HTML_PATH,
  ROOT,
  computeDashboardSourceHash,
  dashboardFreshnessError,
  deriveRun,
  readGraph,
  readRepoFile,
  readWorkflowDoc,
  validateWorkflowProgress,
  type DerivedRun,
  type WorkflowDoc,
} from "./workflow-progress";

export type DashboardData = {
  repository: { slug: string; branch: string };
  focus_run: string | null;
  source_hash: string;
  workflow_updated: string;
  runs: DerivedRun[];
};

function escapeForScript(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

export function buildDashboardData(workflow: WorkflowDoc, warnings: string[]): DashboardData {
  const runs = workflow.runs
    .map((definition) => {
      const graphPath = definition.canonical.progress_graph;
      return deriveRun(definition, readGraph(graphPath), graphPath, warnings);
    })
    .sort((a, b) => (b.last_activity ?? "").localeCompare(a.last_activity ?? "") || a.id.localeCompare(b.id));

  return {
    repository: {
      slug: workflow.repository?.slug ?? "",
      branch: workflow.repository?.default_branch ?? "main",
    },
    focus_run: workflow.focus_run ?? null,
    source_hash: computeDashboardSourceHash(workflow),
    workflow_updated: workflow.updated,
    runs,
  };
}

export function renderDashboardHtml(data: DashboardData): string {
  const css = readRepoFile("piro/tooling/workflow-dashboard/styles.css");
  const js = readRepoFile("piro/tooling/workflow-dashboard/client.js");
  const logoDataUri = `data:image/png;base64,${readFileSync(join(ROOT, "piro/dashboard/ChatGPT Image 30 Sept 2026, 10_44_28.png")).toString("base64")}`;
  if (/<\/script/i.test(js)) throw new Error("client.js must not contain a closing script tag");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="workflow-source-hash" content="${data.source_hash}">
<meta name="robots" content="noindex, nofollow">
<title>PIRO Dashboard · ${escapeHtml(data.repository.slug || "repository")}</title>
<style>
${css}
</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div id="app" class="app" aria-busy="true">
<noscript><p class="noscript">This dashboard needs JavaScript to render. The data is embedded in this file.</p></noscript>
</div>
<div id="announcer" class="sr-only" aria-live="polite"></div>
<script type="application/json" id="piro-logo">${escapeForScript(JSON.stringify(logoDataUri))}</script>
<script type="application/json" id="workflow-data">${escapeForScript(JSON.stringify(data))}</script>
<script>
${js}
</script>
</body>
</html>
`;
}

function main() {
  const check = process.argv.includes("--check");
  const workflow = readWorkflowDoc();
  const { errors, warnings } = validateWorkflowProgress(workflow);

  if (errors.length > 0) {
    console.error("Workflow progress graph has errors; dashboard not generated:\n");
    for (const error of errors) console.error(`\u2717 ${error}`);
    process.exit(1);
  }

  if (check) {
    const stale = dashboardFreshnessError(workflow);
    if (stale) {
      console.error(`\u2717 ${stale}`);
      process.exit(1);
    }
    console.log(`\u2713 ${DASHBOARD_HTML_PATH} is fresh`);
    return;
  }

  const html = renderDashboardHtml(buildDashboardData(workflow, warnings));
  const outPath = join(ROOT, DASHBOARD_HTML_PATH);
  mkdirSync(dirname(outPath), { recursive: true });
  let previous = "";
  try {
    previous = readFileSync(outPath, "utf8");
  } catch {
    previous = "";
  }
  if (previous === html) {
    console.log(`\u2713 ${DASHBOARD_HTML_PATH} already up to date`);
  } else {
    writeFileSync(outPath, html);
    console.log(`\u2713 wrote ${DASHBOARD_HTML_PATH}`);
  }
  for (const warning of warnings) console.log(`\u26a0 ${warning}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
