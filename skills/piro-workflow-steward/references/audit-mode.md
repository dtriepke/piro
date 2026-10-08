# Audit mode

Use audit mode for artifact governance, structural cleanup, duplicate detection, missing relationships, and control-plane repair. Read the Artifact Classification, Duplicate Prevention, and Artifact Cleanup sections in `.github/copilot-instructions.md` before making placement decisions.

Audit is repair, not enforcement. Start with findings, preserve content, apply only safe mechanical corrections automatically, and ask before destructive or judgment-laden changes.

## Pipeline

```text
Inspect repository -> Discover workflow artifacts -> Detect misplaced docs ->
Detect duplicates -> Detect missing relationships -> Move / consolidate ->
Repair links -> Update artifact index
```

1. Run `npm run validate:workflow`. Treat its output as the seed for findings, not a replacement for manual checks.
2. Read `piro/workflow.yaml` and `piro/runs-index.md`, list `piro/runs/`, and flag membership or pointer disagreements.
3. Look for workflow-like artifacts outside `piro/`, including `docs/`, `notes/`, root Markdown, and legacy `issues/` trees. Treat pre-`piro/` folders as informational findings; do not move them without user approval because they may be live data sources.
4. Walk canonical run folders and record files. Empty folders are not artifacts.
5. Classify document content by purpose and flag misplaced files, including artifacts directly under `piro/` outside an allowed run or `00-context/` location.
6. Detect duplicate concerns and versioned duplicate names such as `*-v2`, `*-final`, `*-new`, and `*-updated`. Prefer the declared canonical, current, complete artifact, but do not choose silently when content conflicts.
7. Check the traceability chain: research -> PRD/PID -> Specs + Design + ADRs -> solutioning issue contracts -> implementation phase plans/work-package tracking -> implementation -> review -> release/ops.
8. For a decomposed issue, check that its solutioning issue contract links to its phase-plan directory under `02-implement/implementation-plan/<issue-id>/`, and flag missing/broken links or unreferenced phase plans. Do not infer phase status from artifact presence.
9. Specifically flag issues with missing or broken source links, completed work without review evidence, releases without reviewed implementation, missing cross-referenced ADRs/specs, and declared phases that disagree with verified progress-graph state.
10. Present the complete findings before modifying files.
11. Apply only unambiguous mechanical fixes in scope. A straight move still requires confirmation when its classification is not indisputable. Never discard unique content; consolidate it into the canonical artifact before removing a duplicate, and ask when the files disagree.
12. After a confirmed move or consolidation, search the repository for references to the old path and repair links in `piro/`, `AGENTS.md`, `.github/`, and source comments.
13. Reconcile the progress graph, `piro/workflow.yaml`, and `piro/runs-index.md` only when evidence justifies a change. Keep both graph aliases identical.
14. Regenerate the dashboard and run both workflow validation gates.

## Repair discipline

- Report before acting.
- Preserve meaningful content.
- Ask before deletion, conflicting merges, or moving legacy trees.
- Report ambiguous cases rather than forcing closure.
- A finding without a safe automatic fix is still useful.

## Output shape

### Artifact governance report

**Scope:** `<all runs | run-id | folder>`

#### Misplaced

- ❌ `<path>` -> should be `<path>`

#### Duplicates

- ❌ `<path>` -> duplicates `<canonical path>`

#### Missing relationships

- ❌ `<artifact>` -> missing `<parent/child/review>`

#### Applied automatically

- Mechanical moves or link repairs actually made, or `None`.

#### Needs your decision

- Ambiguous cases with concrete options, or `None`.

#### Index updated

- Yes/no and what changed.
