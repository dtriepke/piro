/* Workflow dashboard client. Inlined into piro/dashboard/index.html by piro/tooling/workflow-dashboard.ts. */
(function () {
  "use strict";

  var DATA = JSON.parse(document.getElementById("workflow-data").textContent);
  var LOGO_DATA_URI = JSON.parse(document.getElementById("piro-logo").textContent);
  var app = document.getElementById("app");
  var announcer = document.getElementById("announcer");

  var STATES = {
    ready: { label: "Ready", icon: "\u25B6" },
    in_progress: { label: "In progress", icon: "\u25D0" },
    awaiting_feedback: { label: "Awaiting feedback", icon: "\u29D7" },
    changes_requested: { label: "Changes requested", icon: "\u21BA" },
    blocked: { label: "Blocked", icon: "\u2715" },
    done: { label: "Done", icon: "\u2713" },
    not_started: { label: "Not started", icon: "\u25CB" },
    not_applicable: { label: "Not applicable", icon: "\u2013" },
  };
  var FILTERS = [
    { id: "active", label: "Active", states: ["ready", "in_progress"] },
    { id: "blocked", label: "Blocked", states: ["blocked"] },
    { id: "feedback", label: "Awaiting feedback", states: ["awaiting_feedback", "changes_requested"] },
    { id: "done", label: "Done", states: ["done", "not_applicable"] },
  ];
  var TABS = [
    { id: "plan", label: "Plan", phases: ["CONTEXT", "RESEARCH", "PLANNING", "SOLUTIONING"] },
    { id: "implement", label: "Implement", phases: ["IMPLEMENT"] },
    { id: "review", label: "Review", phases: ["REVIEW"] },
    { id: "ops", label: "Ops", phases: ["OPS"] },
  ];
  var PLAN_SECTIONS = [
    {
      title: "Research",
      sub: "parallel research streams inform planning",
      lanes: [
        ["research-business", "Business"],
        ["research-ux", "UX"],
        ["research-technology", "Technology"],
      ],
    },
    { title: "Planning", sub: "what we commit to", lanes: [["planning", "PRD / PID \u00B7 Scope \u00B7 Roadmap"]] },
    {
      title: "Solutioning",
      sub: "peer streams; all must be settled before implementation",
      lanes: [
        ["solutioning-specs", "Specs"],
        ["solutioning-design", "Design"],
        ["solutioning-decisions", "Decisions"],
      ],
    },
  ];
  var REVIEW_TRACKS = [
    ["automated_tests", "Automated tests"],
    ["code_review", "Code review"],
    ["security", "Security"],
    ["ux_acceptance", "UX / product acceptance"],
    ["accessibility", "Accessibility"],
    ["domain_approval", "Domain / SME approval"],
  ];
  var KIND_LABELS = {
    artifact: "Artifact",
    work_package: "Work package",
    human_gate: "Human gate",
    review: "Review",
    release: "Release",
  };
  var PROMPT_VERBS = {
    ready: "Start",
    in_progress: "Continue",
    awaiting_feedback: "Collect and record my feedback on",
    changes_requested: "Address the requested changes on",
    blocked: "Help resolve the blocker on",
    not_started: "Prepare",
    done: "Audit the recorded evidence for",
    not_applicable: "Confirm the not-applicable rationale for",
  };

  var ui = { run: null, tab: null, q: "", filters: [], node: null, links: "auto" };
  var runsById = {};
  DATA.runs.forEach(function (run) {
    runsById[run.id] = run;
  });

  /* ---------- helpers ---------- */

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "className") el.className = value;
        else if (key === "text") el.textContent = value;
        else if (key === "style") el.setAttribute("style", value);
        else if (key.indexOf("on") === 0) el.addEventListener(key.slice(2), value);
        else el.setAttribute(key, value === true ? "" : String(value));
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function append(el, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) child.forEach(function (c) { append(el, c); });
    else if (typeof child === "string" || typeof child === "number") el.appendChild(document.createTextNode(String(child)));
    else el.appendChild(child);
  }

  function announce(message) {
    announcer.textContent = "";
    window.setTimeout(function () { announcer.textContent = message; }, 30);
  }

  function currentRun() {
    return runsById[ui.run];
  }

  function nodeById(run, id) {
    for (var i = 0; i < run.nodes.length; i++) if (run.nodes[i].id === id) return run.nodes[i];
    return null;
  }

  function isSettled(state) {
    return state === "done" || state === "not_applicable";
  }

  function tabForPhase(phase) {
    for (var i = 0; i < TABS.length; i++) if (TABS[i].phases.indexOf(phase) !== -1) return TABS[i].id;
    return "plan";
  }

  function linkMode() {
    if (ui.links !== "auto") return ui.links;
    return window.location.protocol === "file:" || !DATA.repository.slug ? "local" : "github";
  }

  function hrefFor(path) {
    if (linkMode() === "github" && DATA.repository.slug) {
      return "https://github.com/" + DATA.repository.slug + "/blob/" + encodeURIComponent(DATA.repository.branch) + "/" + encodeURI(path);
    }
    return "../../" + encodeURI(path);
  }

  function issueLabel(url) {
    var match = /\/issues\/(\d+)/.exec(url || "");
    return match ? "#" + match[1] : "issue";
  }

  function stateBadge(state) {
    var meta = STATES[state] || { label: state, icon: "?" };
    return h(
      "span",
      { className: "state", "data-state": state },
      h("span", { className: "icon", "aria-hidden": "true", text: meta.icon }),
      meta.label,
    );
  }

  /* ---------- URL hash state ---------- */

  function readHash() {
    var params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    var requestedRun = params.get("run");
    ui.run = runsById[requestedRun]
      ? requestedRun
      : runsById[DATA.focus_run]
        ? DATA.focus_run
        : DATA.runs.length
          ? DATA.runs[0].id
          : null;
    var run = currentRun();
    var tab = params.get("tab");
    ui.tab = TABS.some(function (t) { return t.id === tab; }) ? tab : run ? tabForPhase(run.derived_phase) : "plan";
    ui.q = params.get("q") || "";
    ui.filters = (params.get("f") || "").split(",").filter(function (f) {
      return FILTERS.some(function (def) { return def.id === f; });
    });
    var node = params.get("node");
    ui.node = run && node && nodeById(run, node) ? node : null;
    var links = params.get("links");
    ui.links = links === "local" || links === "github" ? links : "auto";
  }

  function writeHash(push) {
    var params = new URLSearchParams();
    if (ui.run) params.set("run", ui.run);
    if (ui.tab) params.set("tab", ui.tab);
    if (ui.q) params.set("q", ui.q);
    if (ui.filters.length) params.set("f", ui.filters.join(","));
    if (ui.node) params.set("node", ui.node);
    if (ui.links !== "auto") params.set("links", ui.links);
    var hash = "#" + params.toString();
    if (hash === window.location.hash) return;
    if (push) window.history.pushState(null, "", hash);
    else window.history.replaceState(null, "", hash);
  }

  function update(changes, options) {
    Object.keys(changes).forEach(function (key) { ui[key] = changes[key]; });
    writeHash(options && options.push);
    render(options);
  }

  function selectNode(id) {
    var run = currentRun();
    var node = nodeById(run, id);
    if (!node) return;
    update({ node: id, tab: node.area }, { push: true, focusDetails: true });
  }

  /* ---------- filtering ---------- */

  function matches(node) {
    if (ui.filters.length) {
      var allowed = [];
      ui.filters.forEach(function (id) {
        FILTERS.forEach(function (def) { if (def.id === id) allowed = allowed.concat(def.states); });
      });
      if (allowed.indexOf(node.derived_state) === -1) return false;
    }
    if (!ui.q) return true;
    var haystack = [node.id, node.title, node.description, node.stream, node.producer, node.blocker, node.feedback]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return ui.q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every(function (term) { return haystack.indexOf(term) !== -1; });
  }

  /* ---------- prompt ---------- */

  function promptFor(run, node) {
    var lines = [];
    var verb = PROMPT_VERBS[node.derived_state] || "Work on";
    lines.push(verb + " workflow node " + node.id + " \u2014 " + node.title + ".");
    lines.push("");
    lines.push("Run: " + run.id);
    lines.push("Area / stream: " + node.area + " / " + node.stream + " (" + (KIND_LABELS[node.kind] || node.kind) + ")");
    lines.push("Current state: " + node.derived_state);
    if (node.producer) lines.push("Expected producer: " + node.producer);
    if (node.execution) lines.push("Execution type: " + node.execution);
    if (node.depends_on.length) {
      lines.push(
        "Depends on: " +
          node.depends_on
            .map(function (id) {
              var dep = nodeById(run, id);
              return id + " (" + (dep ? dep.derived_state : "unknown") + ")";
            })
            .join(", "),
      );
    }
    if (node.blocker) lines.push("Blocker: " + node.blocker);
    if (node.feedback) lines.push("Feedback: " + node.feedback);
    if (node.evidence.length) {
      lines.push("Artifacts:");
      node.evidence.forEach(function (item) { lines.push("- " + item.type + ": " + item.path); });
    }
    if (node.github_issue) lines.push("Tracker: " + node.github_issue.url + " (stored snapshot: " + node.github_issue.state + ")");
    lines.push("");
    lines.push(
      "In the same change, update node " +
        node.id +
        " in " +
        run.graph_path +
        " (state, updated_at, typed evidence; refresh the GitHub snapshot if the tracker issue changed), keep workflow.yaml and runs-index.md in sync, then run `npm run validate:workflow` and `npm run workflow:dashboard`.",
    );
    return lines.join("\n");
  }

  function copyText(text) {
    function fallback() {
      var area = h("textarea", { style: "position:fixed;left:-9999px;top:0", "aria-hidden": "true" });
      area.value = text;
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
      document.body.removeChild(area);
      announce(ok ? "Agent prompt copied to clipboard" : "Copy failed; select the prompt text manually");
      if (!ok) window.prompt("Copy the agent prompt:", text);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { announce("Agent prompt copied to clipboard"); }, fallback);
    } else {
      fallback();
    }
  }

  /* ---------- header ---------- */

  function renderTopbar(run) {
    var select = h("select", {
      id: "run-select",
      onchange: function (event) {
        var id = event.target.value;
        update({ run: id, node: null, tab: tabForPhase(runsById[id].derived_phase) }, { push: true });
      },
    });
    DATA.runs.forEach(function (r) {
      var option = h("option", { value: r.id, text: r.id + " \u00B7 " + r.derived_phase });
      if (r.id === ui.run) option.selected = true;
      select.appendChild(option);
    });
    return h(
      "header",
      { className: "topbar" },
      h(
        "div",
        { className: "brand" },
        h("img", { className: "brand-logo", src: LOGO_DATA_URI, alt: "PIRO logo" }),
        h("h1", { text: "PIRO Dashboard" }),
      ),
      h("div", { className: "run-picker" }, h("label", { for: "run-select", text: "Run" }), select),
      h(
        "p",
        { className: "meta" },
        "Graph updated " + run.updated + " \u00B7 source ",
        h("code", { title: DATA.source_hash, text: DATA.source_hash.slice(0, 10) }),
        " \u00B7 read-only snapshot of committed artifacts",
      ),
    );
  }

  function renderSummary(run) {
    var mismatch = run.declared_phase !== run.derived_phase;
    var position = h(
      "section",
      { className: "panel position", "aria-labelledby": "position-label" },
      h("p", { className: "eyebrow", id: "position-label", text: "Current position" }),
      h("p", { className: "position-value", text: run.derived_phase }),
      mismatch ? h("p", { className: "position-note", text: "workflow.yaml declares " + run.declared_phase }) : null,
      run.warnings.length
        ? h(
            "details",
            { className: "drift has-warnings" },
            h("summary", { text: "\u26A0 " + run.warnings.length + " status drift warning" + (run.warnings.length === 1 ? "" : "s") }),
            h("ul", null, run.warnings.map(function (w) { return h("li", { text: w.replace(run.id + ":", "").replace(run.id + " ", "") }); })),
          )
        : h("p", { className: "drift-clean", text: "\u2713 No status drift detected" }),
    );

    var next = run.next_action_id ? nodeById(run, run.next_action_id) : null;
    var nextPanel;
    if (!next) {
      nextPanel = h(
        "section",
        { className: "panel next", "aria-labelledby": "next-label" },
        h("p", { className: "eyebrow", id: "next-label", text: "What\u2019s next" }),
        h("p", { className: "next-title", text: "Nothing actionable \u2014 all required nodes are settled." }),
      );
    } else {
      var evidence = next.evidence[0];
      nextPanel = h(
        "section",
        { className: "panel next", "aria-labelledby": "next-label" },
        h("p", { className: "eyebrow", id: "next-label", text: "What\u2019s next" }),
        h("p", { className: "next-title" }, stateBadge(next.derived_state), h("span", { text: next.title }), h("code", { text: next.id })),
        h(
          "p",
          { className: "next-sub" },
          (TABS.filter(function (t) { return t.id === next.area; })[0] || { label: next.area }).label +
            " \u203A " +
            next.stream +
            (next.producer ? " \u00B7 producer: " + next.producer : "") +
            (next.blocker ? " \u00B7 blocker: " + next.blocker : "") +
            (next.feedback ? " \u00B7 feedback: " + next.feedback : ""),
        ),
        h(
          "div",
          { className: "next-actions" },
          h("button", { type: "button", className: "btn primary", onclick: function () { copyText(promptFor(run, next)); } }, "Copy agent prompt"),
          evidence
            ? h("a", { className: "btn", href: hrefFor(evidence.path), target: "_blank", rel: "noopener" }, "Open " + evidence.type.replace(/_/g, " "))
            : h("span", { className: "btn", "aria-disabled": "true" }, "No evidence yet"),
          h("button", { type: "button", className: "btn", onclick: function () { selectNode(next.id); } }, "Show details"),
        ),
        run.parallel_ids.length
          ? h(
              "div",
              { className: "parallel" },
              h("span", { text: "Can run in parallel:" }),
              run.parallel_ids.map(function (id) {
                var node = nodeById(run, id);
                return h("button", { type: "button", className: "linklike", onclick: function () { selectNode(id); } }, id + (node ? " (" + STATES[node.derived_state].label.toLowerCase() + ")" : ""));
              }),
            )
          : null,
      );
    }
    return h("div", { className: "summary" }, position, nextPanel);
  }

  /* ---------- tabs and toolbar ---------- */

  function renderTabs(run) {
    var currentTab = tabForPhase(run.derived_phase);
    var list = h("div", { className: "tabs", role: "tablist", "aria-label": "Lifecycle areas" });
    TABS.forEach(function (tab, index) {
      var nodes = run.nodes.filter(function (n) { return n.area === tab.id; });
      var settled = nodes.filter(function (n) { return isSettled(n.derived_state); }).length;
      var active = nodes.some(function (n) { return ["ready", "in_progress", "awaiting_feedback", "changes_requested", "blocked"].indexOf(n.derived_state) !== -1; });
      var selected = tab.id === ui.tab;
      list.appendChild(
        h(
          "button",
          {
            type: "button",
            className: "tab",
            role: "tab",
            id: "tab-" + tab.id,
            "aria-selected": selected ? "true" : "false",
            "aria-controls": "tabpanel",
            tabindex: selected ? "0" : "-1",
            onclick: function () { update({ tab: tab.id }, { push: true }); },
            onkeydown: function (event) {
              var delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
              var target = null;
              if (delta) target = TABS[(index + delta + TABS.length) % TABS.length];
              if (event.key === "Home") target = TABS[0];
              if (event.key === "End") target = TABS[TABS.length - 1];
              if (!target) return;
              event.preventDefault();
              update({ tab: target.id }, { push: true, focusTab: target.id });
            },
          },
          h("span", { className: "label", text: tab.label }),
          tab.id === currentTab ? h("span", { className: "current", text: "current" }) : null,
          active ? h("span", { className: "activity", title: "Has actionable nodes", "aria-label": "has actionable nodes" }) : null,
          h("span", { className: "count", title: settled + " of " + nodes.length + " settled", text: settled + "/" + nodes.length }),
        ),
      );
    });
    return list;
  }

  function renderToolbar() {
    var search = h("input", {
      type: "search",
      id: "node-search",
      placeholder: "Search id, title, stream\u2026",
      "aria-label": "Search nodes",
      value: ui.q,
      oninput: function (event) { update({ q: event.target.value }, { keepFocus: "node-search" }); },
    });
    var chips = h("div", { className: "chips", role: "group", "aria-label": "Filter by state" });
    FILTERS.forEach(function (def) {
      var pressed = ui.filters.indexOf(def.id) !== -1;
      chips.appendChild(
        h("button", {
          type: "button",
          className: "chip",
          "aria-pressed": pressed ? "true" : "false",
          text: def.label,
          onclick: function () {
            var next = pressed ? ui.filters.filter(function (f) { return f !== def.id; }) : ui.filters.concat(def.id);
            update({ filters: next }, { keepFocus: null });
          },
        }),
      );
    });
    var links = h("select", {
      id: "link-mode",
      onchange: function (event) { update({ links: event.target.value }); },
    });
    [["auto", "Auto"], ["local", "Local files"], ["github", "GitHub"]].forEach(function (pair) {
      var option = h("option", { value: pair[0], text: pair[1] });
      if (ui.links === pair[0]) option.selected = true;
      links.appendChild(option);
    });
    return h(
      "div",
      { className: "toolbar" },
      search,
      chips,
      ui.q || ui.filters.length ? h("button", { type: "button", className: "linklike", onclick: function () { update({ q: "", filters: [] }); } }, "Clear filters") : null,
      h("label", { className: "links", for: "link-mode" }, "Links", links),
    );
  }

  /* ---------- cards ---------- */

  function renderCard(run, node) {
    var badges = [];
    if (run.next_action_id === node.id) badges.push(h("span", { className: "badge next", text: "Next" }));
    if (node.execution) badges.push(h("span", { className: "badge", text: node.execution }));
    if (node.required === false) badges.push(h("span", { className: "badge", text: "Optional" }));
    if (node.github_issue) badges.push(h("span", { className: "badge", text: issueLabel(node.github_issue.url) + " " + node.github_issue.state }));
    if (node.local_only) badges.push(h("span", { className: "badge", text: "Local only" }));
    if (node.depends_on.length && !isSettled(node.derived_state)) {
      var open = node.depends_on.filter(function (id) { var d = nodeById(run, id); return d && !isSettled(d.state); });
      if (open.length) badges.push(h("span", { className: "badge", text: "Waits on " + open.length }));
    }
    return h(
      "button",
      {
        type: "button",
        className: "card" + (run.next_action_id === node.id ? " is-next" : ""),
        "data-state": node.derived_state,
        "data-node": node.id,
        "aria-pressed": ui.node === node.id ? "true" : "false",
        onclick: function () { selectNode(node.id); },
      },
      h("span", { className: "top" }, h("span", { className: "id", text: node.id }), stateBadge(node.derived_state)),
      h("span", { className: "title", text: node.title }),
      badges.length ? h("span", { className: "badges" }, badges) : null,
    );
  }

  function renderLane(run, nodes, stream, label) {
    var laneNodes = nodes.filter(function (n) { return n.stream === stream; });
    var visible = laneNodes.filter(matches);
    return h(
      "div",
      { className: "lane" },
      h("h3", { text: label + " (" + laneNodes.filter(function (n) { return isSettled(n.derived_state); }).length + "/" + laneNodes.length + ")" }),
      h(
        "div",
        { className: "cards" },
        visible.length
          ? visible.map(function (n) { return renderCard(run, n); })
          : h("p", { className: "empty", text: laneNodes.length ? "No matching nodes" : "No nodes" }),
      ),
    );
  }

  function renderOther(run, nodes, known, title) {
    var others = nodes.filter(function (n) { return known.indexOf(n.stream) === -1; });
    if (!others.length) return null;
    var streams = [];
    others.forEach(function (n) { if (streams.indexOf(n.stream) === -1) streams.push(n.stream); });
    return h(
      "section",
      { className: "panel section" },
      h("h2", { text: title }),
      h("div", { className: "lanes", style: "--lanes:" + Math.min(streams.length, 3) }, streams.map(function (s) { return renderLane(run, others, s, s); })),
    );
  }

  /* ---------- tab panels ---------- */

  function renderPlan(run) {
    var nodes = run.nodes.filter(function (n) { return n.area === "plan"; });
    var known = [];
    var sections = PLAN_SECTIONS.map(function (section) {
      section.lanes.forEach(function (lane) { known.push(lane[0]); });
      return h(
        "section",
        { className: "panel section" },
        h("h2", null, section.title, h("span", { className: "sub", text: section.sub })),
        h("div", { className: "lanes", style: "--lanes:" + section.lanes.length }, section.lanes.map(function (lane) { return renderLane(run, nodes, lane[0], lane[1]); })),
      );
    });
    return [sections, renderOther(run, nodes, known, "Other plan nodes")];
  }

  function renderImplement(run) {
    var nodes = run.nodes.filter(function (n) { return n.area === "implement"; });
    var visible = nodes.filter(matches);
    var waves = [];
    visible.forEach(function (n) {
      (waves[n.wave] = waves[n.wave] || []).push(n);
    });

    var graph = h("div", { className: "graph", id: "impl-graph" });
    waves.forEach(function (wave, index) {
      if (!wave) return;
      graph.appendChild(
        h(
          "div",
          { className: "wave" },
          h("h3", { text: "Wave " + (index + 1) }),
          wave
            .sort(function (a, b) { return b.critical_path_length - a.critical_path_length || a.id.localeCompare(b.id); })
            .map(function (n) { return renderCard(run, n); }),
        ),
      );
    });

    var graphSection = h(
      "section",
      { className: "panel section" },
      h("h2", null, "Dependency graph", h("span", { className: "sub", text: "execution waves, left to right; lines show dependencies (green = satisfied)" })),
      visible.length ? h("div", { className: "graph-wrap" }, graph) : h("p", { className: "empty", text: "No matching implementation nodes." }),
    );

    var sortKey = ui.sort || "wave";
    var rows = visible.slice().sort(function (a, b) {
      if (sortKey === "state") return a.derived_state.localeCompare(b.derived_state) || a.id.localeCompare(b.id);
      if (sortKey === "id") return a.id.localeCompare(b.id);
      return a.wave - b.wave || a.id.localeCompare(b.id);
    });
    function th(label, key) {
      return h(
        "th",
        { scope: "col", "aria-sort": key && sortKey === key ? "ascending" : null },
        key ? h("button", { type: "button", onclick: function () { ui.sort = key; render(); } }, label) : label,
      );
    }
    var table = h(
      "table",
      null,
      h("caption", { text: "Implementation nodes (" + visible.length + " of " + nodes.length + ")" }),
      h("thead", null, h("tr", null, th("ID", "id"), th("Title"), th("Type"), th("State", "state"), th("Wave", "wave"), th("Depends on"), th("Tracker snapshot"), th("Updated"))),
      h(
        "tbody",
        null,
        rows.map(function (n) {
          return h(
            "tr",
            { className: ui.node === n.id ? "is-selected" : "" },
            h("td", null, h("button", { type: "button", className: "linklike mono", onclick: function () { selectNode(n.id); } }, n.id)),
            h("td", { text: n.title }),
            h("td", { text: (n.execution ? n.execution + " " : "") + (KIND_LABELS[n.kind] || n.kind) }),
            h("td", null, stateBadge(n.derived_state)),
            h("td", { text: String(n.wave + 1) }),
            h("td", { className: "mono", text: n.depends_on.join(", ") || "\u2014" }),
            h(
              "td",
              null,
              n.github_issue
                ? h("a", { href: n.github_issue.url, target: "_blank", rel: "noopener" }, issueLabel(n.github_issue.url) + " " + n.github_issue.state)
                : n.local_only
                  ? "local only"
                  : "\u2014",
            ),
            h("td", { text: n.updated_at }),
          );
        }),
      ),
    );
    return [graphSection, h("section", { className: "panel section" }, h("div", { className: "table-wrap" }, table))];
  }

  function renderReview(run) {
    var nodes = run.nodes.filter(function (n) { return n.area === "review"; });
    var configured = REVIEW_TRACKS.filter(function (track) { return nodes.some(function (n) { return n.stream === track[0]; }); });
    var section = h(
      "section",
      { className: "panel section" },
      h("h2", null, "Review tracks", h("span", { className: "sub", text: "tracks configured for this run; optional tracks do not gate release" })),
      configured.length
        ? h("div", { className: "lanes", style: "--lanes:" + Math.min(configured.length, 3) }, configured.map(function (track) { return renderLane(run, nodes, track[0], track[1]); }))
        : h("p", { className: "empty", text: "No review tracks configured for this run." }),
    );
    return [section, renderOther(run, nodes, REVIEW_TRACKS.map(function (t) { return t[0]; }), "Other review nodes")];
  }

  function renderOps(run) {
    var nodes = run.nodes.filter(function (n) { return n.area === "ops"; });
    return [
      h(
        "section",
        { className: "panel section" },
        h("h2", null, "Release readiness", h("span", { className: "sub", text: "consumes the required review tracks" })),
        h("div", { className: "lanes", style: "--lanes:1" }, renderLane(run, nodes, "release", "Release")),
      ),
      renderOther(run, nodes, ["release"], "Other ops nodes"),
    ];
  }

  /* ---------- details ---------- */

  function renderImplementationProgress(node) {
    var phases = node.phases || [];
    if (!phases.length) return null;
    var settled = phases.filter(function (item) { return isSettled(item.state); }).length;
    return h(
      "section",
      { className: "implementation-progress", "aria-labelledby": "implementation-progress-heading" },
      h("h3", { id: "implementation-progress-heading", text: "Progress" }),
      h("p", { className: "progress-summary", text: settled + " of " + phases.length + " phases settled." }),
      h("progress", { max: phases.length, value: settled, "aria-label": "Phase progress for " + node.id }),
      h(
        "ol",
        null,
        phases.map(function (phase) {
          return h(
            "li",
            null,
            h("span", { className: "mono", text: phase.id }),
            stateBadge(phase.state),
            h("span", { className: "progress-title", text: phase.title + (phase.updated_at ? " \u00B7 " + phase.updated_at : "") }),
            phase.note ? h("p", { className: "progress-note", text: phase.note }) : null,
          );
        }),
      ),
    );
  }

  function renderDetails(run) {
    var panel = h("aside", { className: "panel details", "aria-labelledby": "details-heading" });
    var node = ui.node ? nodeById(run, ui.node) : null;
    if (!node) {
      panel.appendChild(h("h2", { id: "details-heading", text: "Details" }));
      panel.appendChild(h("p", { className: "empty", text: "Select a node to see its evidence, dependencies, and tracker snapshot." }));
      return panel;
    }

    function depItem(id) {
      var dep = nodeById(run, id);
      return h(
        "li",
        null,
        h("button", { type: "button", className: "linklike mono", onclick: function () { selectNode(id); } }, id),
        " ",
        dep ? stateBadge(dep.derived_state) : "unknown",
        dep ? " " + dep.title : "",
      );
    }

    var rows = [
      ["ID", h("code", { text: node.id })],
      ["Area", node.area + " \u203A " + node.stream],
      ["Kind", (node.execution ? node.execution + " " : "") + (KIND_LABELS[node.kind] || node.kind)],
      ["Updated", node.updated_at],
    ];
    if (node.producer) rows.push(["Producer", node.producer]);
    if (node.required === false) rows.push(["Required", "No (optional track)"]);
    if (node.priority) rows.push(["Priority", String(node.priority)]);
    if (node.supersedes && node.supersedes.length) rows.push(["Supersedes", node.supersedes.join(", ")]);
    if (node.decision_ownership && node.decision_ownership.length) rows.push(["Decisions", node.decision_ownership.join(", ")]);

    append(panel, [
      h("p", { className: "eyebrow", text: "Details" }),
      h("h2", { id: "details-heading", tabindex: "-1", text: node.title }),
      stateBadge(node.derived_state),
      node.state !== node.derived_state ? h("span", { className: "empty", text: "  (stored: " + node.state + ")" }) : null,
      h("dl", null, rows.map(function (row) { return [h("dt", { text: row[0] }), h("dd", null, row[1])]; })),
      node.blocker ? h("div", { className: "note blocker" }, h("strong", { text: "Blocker: " }), node.blocker) : null,
      node.feedback ? h("div", { className: "note feedback" }, h("strong", { text: "Feedback: " }), node.feedback) : null,
      node.rationale ? h("div", { className: "note" }, h("strong", { text: "Rationale: " }), node.rationale) : null,
      node.description ? h("p", { text: node.description }) : null,
      renderImplementationProgress(node),
      h("h3", { text: "Depends on" }),
      node.depends_on.length ? h("ul", null, node.depends_on.map(depItem)) : h("p", { className: "empty", text: "Nothing \u2014 root node." }),
      h("h3", { text: "Unblocks" }),
      node.dependents.length ? h("ul", null, node.dependents.map(depItem)) : h("p", { className: "empty", text: "Nothing downstream." }),
      h("h3", { text: "Evidence" }),
      node.evidence.length
        ? h(
            "ul",
            null,
            node.evidence.map(function (item) {
              return h(
                "li",
                null,
                h("span", { className: "badge", text: item.type.replace(/_/g, " ") + (item.outcome ? ": " + item.outcome : "") }),
                " ",
                h("a", { href: hrefFor(item.path), target: "_blank", rel: "noopener", text: item.label || item.path.split("/").pop() }),
              );
            }),
          )
        : h("p", { className: "empty", text: "No evidence recorded." }),
      h("h3", { text: "Tracker" }),
      node.github_issue
        ? h(
            "p",
            null,
            h("a", { href: node.github_issue.url, target: "_blank", rel: "noopener", text: issueLabel(node.github_issue.url) }),
            " " + node.github_issue.state + " \u00B7 stored snapshot checked " + node.github_issue.checked_at + " (not live)",
          )
        : h("p", { className: "empty", text: node.local_only ? "Local only \u2014 no tracker issue expected." : "No tracker issue linked." }),
      h("div", { className: "next-actions", style: "margin-top:12px" }, h("button", { type: "button", className: "btn", onclick: function () { copyText(promptFor(run, node)); } }, "Copy agent prompt")),
    ]);
    return panel;
  }

  /* ---------- dependency edges ---------- */

  function drawEdges() {
    var graph = document.getElementById("impl-graph");
    if (!graph) return;
    var run = currentRun();
    var old = graph.querySelector("svg.edges");
    if (old) old.remove();
    var box = graph.getBoundingClientRect();
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "edges");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", String(graph.scrollWidth));
    svg.setAttribute("height", String(graph.scrollHeight));
    var cards = {};
    graph.querySelectorAll("[data-node]").forEach(function (el) { cards[el.getAttribute("data-node")] = el.getBoundingClientRect(); });
    run.nodes.forEach(function (node) {
      var to = cards[node.id];
      if (!to) return;
      node.depends_on.forEach(function (id) {
        var from = cards[id];
        if (!from) return;
        var x1 = from.right - box.left;
        var y1 = from.top + from.height / 2 - box.top;
        var x2 = to.left - box.left;
        var y2 = to.top + to.height / 2 - box.top;
        var mid = (x1 + x2) / 2;
        var path = document.createElementNS(ns, "path");
        path.setAttribute("d", "M" + x1 + "," + y1 + " C" + mid + "," + y1 + " " + mid + "," + y2 + " " + x2 + "," + y2);
        var dep = nodeById(run, id);
        if (dep && isSettled(dep.state)) path.setAttribute("class", "satisfied");
        svg.appendChild(path);
      });
    });
    graph.insertBefore(svg, graph.firstChild);
  }

  /* ---------- render ---------- */

  function render(options) {
    options = options || {};
    app.textContent = "";
    app.removeAttribute("aria-busy");
    var run = currentRun();
    if (!run) {
      app.appendChild(h("p", { className: "empty", text: "No runs found in piro/workflow.yaml." }));
      return;
    }

    var panelContent;
    if (ui.tab === "plan") panelContent = renderPlan(run);
    else if (ui.tab === "implement") panelContent = renderImplement(run);
    else if (ui.tab === "review") panelContent = renderReview(run);
    else panelContent = renderOps(run);

    append(app, [
      renderTopbar(run),
      renderSummary(run),
      renderTabs(run),
      h(
        "main",
        { id: "main" },
        renderToolbar(),
        h(
          "div",
          { className: "workspace" },
          h("div", { id: "tabpanel", role: "tabpanel", "aria-labelledby": "tab-" + ui.tab, tabindex: "-1" }, panelContent),
          renderDetails(run),
        ),
      ),
    ]);

    if (ui.tab === "implement") window.requestAnimationFrame(drawEdges);

    if (options.keepFocus) {
      var input = document.getElementById(options.keepFocus);
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    } else if (options.focusTab) {
      var tab = document.getElementById("tab-" + options.focusTab);
      if (tab) tab.focus();
    } else if (options.focusDetails) {
      var card = document.querySelector('[data-node="' + CSS.escape(ui.node) + '"]');
      if (card) {
        card.focus({ preventScroll: true });
        card.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
      var heading = document.getElementById("details-heading");
      if (heading && window.matchMedia("(max-width: 1024px)").matches) heading.focus();
    }
  }

  window.addEventListener("hashchange", function () { readHash(); render(); });
  window.addEventListener("popstate", function () { readHash(); render(); });
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(drawEdges, 100);
  });

  readHash();
  writeHash(false);
  render();
})();
