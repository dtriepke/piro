import { describe, expect, it } from "vitest";
import {
  computeDashboardSourceHash,
  deriveRun,
  extractDashboardHash,
  validateRunGraph,
  validateWorkflowProgress,
  type ProgressGraph,
  type ProgressNode,
  type WorkflowDoc,
  type WorkflowRun,
} from "./workflow-progress";

const GRAPH = "piro/runs/r1/workflow-progress.yaml";
const exists = (path: string) => !path.includes("missing");

const definition: WorkflowRun = {
  id: "r1",
  slug: "r1",
  phase: "IMPLEMENT",
  canonical: { progress_graph: GRAPH, issue_graph: GRAPH },
  last_activity: "2026-09-28",
};

function node(overrides: Partial<ProgressNode> & { id: string }): ProgressNode {
  return {
    title: overrides.id,
    area: "implement",
    stream: "work-packages",
    kind: "artifact",
    state: "not_started",
    updated_at: "2026-09-20",
    depends_on: [],
    evidence: [],
    ...overrides,
  };
}

const doneArtifact = (id: string, extra: Partial<ProgressNode> = {}) =>
  node({ id, area: "plan", stream: "planning", state: "done", evidence: [{ type: "canonical_artifact", path: `${id}.md` }], ...extra });

function graph(nodes: ProgressNode[]): ProgressGraph {
  return { version: 1, run_id: "r1", updated: "2026-09-28", nodes };
}

function errorsFor(nodes: ProgressNode[], run: WorkflowRun = definition) {
  return validateRunGraph(run, graph(nodes), GRAPH, exists).errors;
}

const closedSnapshot = { url: "https://github.com/o/r/issues/1", state: "closed" as const, checked_at: "2026-09-28T10:00:00Z" };
const wpEvidence = [
  { type: "work_package" as const, path: "wp.md" },
  { type: "source" as const, path: "src/x.ts" },
];

describe("validateRunGraph structural errors", () => {
  it("accepts a consistent graph", () => {
    expect(errorsFor([doneArtifact("prd"), node({ id: "wp", depends_on: ["prd"] })])).toEqual([]);
  });

  it("rejects a persisted ready state", () => {
    expect(errorsFor([node({ id: "a", state: "ready" as never })]).join()).toMatch(/ready is derived/);
  });

  it("rejects unknown dependencies, self-dependencies and cycles", () => {
    expect(errorsFor([node({ id: "a", depends_on: ["ghost"] })]).join()).toMatch(/unknown node ghost/);
    expect(errorsFor([node({ id: "a", depends_on: ["a"] })]).join()).toMatch(/cannot depend on itself/);
    expect(
      errorsFor([node({ id: "a", depends_on: ["b"] }), node({ id: "b", depends_on: ["a"] })]).join(),
    ).toMatch(/dependency cycle/);
  });

  it("rejects duplicate ids, invalid areas and mismatched run ids", () => {
    expect(errorsFor([node({ id: "a" }), node({ id: "a" })]).join()).toMatch(/duplicate node id a/);
    expect(errorsFor([node({ id: "a", area: "deploy" as never })]).join()).toMatch(/invalid area/);
    expect(validateRunGraph({ ...definition, id: "other" }, graph([]), GRAPH, exists).errors.join()).toMatch(/does not match/);
  });

  it("rejects missing evidence files and URL evidence", () => {
    expect(errorsFor([node({ id: "a", evidence: [{ type: "source", path: "missing.ts" }] })]).join()).toMatch(/missing evidence/);
    expect(
      errorsFor([node({ id: "a", evidence: [{ type: "source", path: "https://github.com/x" }] })]).join(),
    ).toMatch(/workspace-relative/);
  });
});

describe("validateRunGraph done-state rules", () => {
  it("rejects done while a dependency is unsettled", () => {
    const errors = errorsFor([node({ id: "prd", area: "plan", stream: "planning" }), doneArtifact("spec", { depends_on: ["prd"] })]);
    expect(errors.join()).toMatch(/done while dependency prd is not_started/);
  });

  it("accepts not_applicable dependencies", () => {
    const na = node({ id: "scope", area: "plan", stream: "planning", state: "not_applicable", rationale: "in PRD" });
    expect(errorsFor([na, doneArtifact("spec", { depends_on: ["scope"] })])).toEqual([]);
  });

  it("requires typed evidence per kind", () => {
    expect(errorsFor([node({ id: "a", state: "done" })]).join()).toMatch(/no canonical_artifact/);
    expect(
      errorsFor([node({ id: "wp", kind: "work_package", state: "done", local_only: true, evidence: [{ type: "work_package", path: "wp.md" }] })]).join(),
    ).toMatch(/no source, migration, or implementation_note/);
    expect(
      errorsFor([node({ id: "r", kind: "review", area: "review", state: "done", evidence: [{ type: "review_result", path: "r.md" }] })]).join(),
    ).toMatch(/accepted\/approved\/passed/);
    expect(
      errorsFor([node({ id: "g", kind: "human_gate", state: "done", local_only: true, evidence: [{ type: "work_package", path: "g.md" }] })]).join(),
    ).toMatch(/no decision evidence/);
    expect(
      errorsFor([node({ id: "rel", kind: "release", area: "ops", state: "done", evidence: [{ type: "release_decision", path: "rel.md", outcome: "no-go" }] })]).join(),
    ).toMatch(/approved\/go/);
  });

  it("requires a closed GitHub snapshot for tracked work packages", () => {
    const base = { id: "wp", kind: "work_package" as const, state: "done" as const, evidence: wpEvidence, updated_at: "2026-09-28" };
    expect(errorsFor([node(base)]).join()).toMatch(/no stored GitHub issue snapshot/);
    expect(errorsFor([node({ ...base, github_issue: { ...closedSnapshot, state: "open" } })]).join()).toMatch(/snapshot is open/);
    expect(errorsFor([node({ ...base, github_issue: closedSnapshot })])).toEqual([]);
    expect(errorsFor([node({ ...base, local_only: true })])).toEqual([]);
  });

  it("rejects snapshots older than the node update", () => {
    const stale = node({
      id: "wp",
      kind: "work_package",
      state: "done",
      evidence: wpEvidence,
      updated_at: "2026-09-29",
      github_issue: closedSnapshot,
    });
    expect(errorsFor([stale]).join()).toMatch(/predates the node update/);
  });
});

describe("validateRunGraph warnings", () => {
  it("warns on phase mismatch, closed-but-open drift and missing explanations", () => {
    const { errors, warnings } = validateRunGraph(
      { ...definition, phase: "REVIEW" },
      graph([
        node({ id: "wp", kind: "work_package", github_issue: closedSnapshot }),
        node({ id: "b", state: "blocked" }),
        node({ id: "f", state: "awaiting_feedback" }),
      ]),
      GRAPH,
      exists,
    );
    expect(errors).toEqual([]);
    expect(warnings.join("\n")).toMatch(/declares phase REVIEW but graph activity derives IMPLEMENT/);
    expect(warnings.join("\n")).toMatch(/not_started locally but its GitHub snapshot is closed/);
    expect(warnings.join("\n")).toMatch(/blocked without a blocker note/);
    expect(warnings.join("\n")).toMatch(/awaiting_feedback without a feedback note/);
  });
});

describe("validateWorkflowProgress", () => {
  const doc = (runs: WorkflowRun[], extra: Partial<WorkflowDoc> = {}): WorkflowDoc => ({ version: 1, updated: "2026-09-28", runs, ...extra });

  it("requires both graph pointers and requires issue_graph to agree with progress_graph", () => {
    const load = () => graph([]);
    expect(validateWorkflowProgress(doc([{ ...definition, canonical: {} }]), load, exists).errors.join()).toMatch(/no canonical.progress_graph/);
    expect(
      validateWorkflowProgress(doc([{ ...definition, canonical: { progress_graph: GRAPH } }]), load, exists).errors.join(),
    ).toMatch(/no backward-compatible canonical.issue_graph/);
    expect(
      validateWorkflowProgress(doc([{ ...definition, canonical: { progress_graph: GRAPH, issue_graph: "old.yaml" } }]), load, exists).errors.join(),
    ).toMatch(/must point at the unified progress graph/);
  });

  it("rejects an unknown focus run", () => {
    expect(validateWorkflowProgress(doc([definition], { focus_run: "nope" }), () => graph([]), exists).errors.join()).toMatch(/focus_run nope/);
  });
});

describe("deriveRun", () => {
  it("derives ready only when all dependencies are settled", () => {
    const run = deriveRun(definition, graph([doneArtifact("prd"), node({ id: "a", depends_on: ["prd"] }), node({ id: "b", depends_on: ["a"] })]), GRAPH);
    const states = Object.fromEntries(run.nodes.map((n) => [n.id, n.derived_state]));
    expect(states).toEqual({ prd: "done", a: "ready", b: "not_started" });
  });

  it("prefers human feedback over in-progress over ready, then the longest critical path", () => {
    const base = [
      node({ id: "short" }),
      node({ id: "long" }),
      node({ id: "after-long", depends_on: ["long"] }),
      node({ id: "end", depends_on: ["after-long"] }),
    ];
    expect(deriveRun(definition, graph(base), GRAPH).next_action_id).toBe("long");
    expect(deriveRun(definition, graph(base), GRAPH).parallel_ids).toContain("short");
    expect(deriveRun(definition, graph([...base, node({ id: "wip", state: "in_progress" })]), GRAPH).next_action_id).toBe("wip");
    expect(
      deriveRun(definition, graph([...base, node({ id: "wip", state: "in_progress" }), node({ id: "fb", area: "plan", stream: "planning", state: "awaiting_feedback" })]), GRAPH)
        .next_action_id,
    ).toBe("fb");
  });

  it("ignores optional nodes for the next action and current position", () => {
    const run = deriveRun(
      { ...definition, phase: "IMPLEMENT" },
      graph([doneArtifact("prd"), node({ id: "opt", area: "review", stream: "ux_acceptance", kind: "review", required: false })]),
      GRAPH,
    );
    expect(run.next_action_id).toBeNull();
    expect(run.derived_phase).toBe("IMPLEMENT");
  });

  it("derives the furthest active lifecycle area", () => {
    const run = deriveRun(
      definition,
      graph([node({ id: "spec", area: "plan", stream: "solutioning-specs", state: "in_progress" }), node({ id: "rev", area: "review", stream: "code_review", kind: "review", state: "awaiting_feedback" })]),
      GRAPH,
    );
    expect(run.derived_phase).toBe("REVIEW");
    expect(deriveRun(definition, graph([node({ id: "spec", area: "plan", stream: "solutioning-specs" })]), GRAPH).derived_phase).toBe("SOLUTIONING");
  });

  it("assigns execution waves within an area", () => {
    const run = deriveRun(definition, graph([doneArtifact("prd"), node({ id: "a", depends_on: ["prd"] }), node({ id: "b", depends_on: ["a"] })]), GRAPH);
    expect(run.nodes.find((n) => n.id === "a")?.wave).toBe(0);
    expect(run.nodes.find((n) => n.id === "b")?.wave).toBe(1);
    expect(run.nodes.find((n) => n.id === "a")?.dependents).toEqual(["b"]);
  });
});

describe("dashboard source hash", () => {
  const workflow: WorkflowDoc = { version: 1, updated: "2026-09-28", runs: [definition] };

  it("changes when any input changes and ignores line endings", () => {
    const files: Record<string, string> = { [GRAPH]: "a: 1\n" };
    const read = (path: string) => files[path] ?? "same";
    const first = computeDashboardSourceHash(workflow, read);
    files[GRAPH] = "a: 1\r\n";
    expect(computeDashboardSourceHash(workflow, read)).toBe(first);
    files[GRAPH] = "a: 2\n";
    expect(computeDashboardSourceHash(workflow, read)).not.toBe(first);
  });

  it("extracts the embedded hash", () => {
    const hash = "a".repeat(64);
    expect(extractDashboardHash(`<meta name="workflow-source-hash" content="${hash}">`)).toBe(hash);
    expect(extractDashboardHash("<html></html>")).toBeNull();
  });
});
