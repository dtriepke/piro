# Coding Model Selection Snapshot

Last updated: 2026-09-29
Purpose: dated model reference for planner Section 15. Compare model fit after scoring the task's actual contract, security, migration, and verification risk. This is API documentation, not a guarantee of availability or billing in the agent's workspace.

## Models requested for this snapshot

Prices are standard API USD per million text input/output tokens as shown on the linked provider pages on the update date. Caching, long-context, processing-tier, and tool charges may differ. Capability and speed descriptions are provider positioning, not a cross-provider benchmark.

| Model | API ID | Provider status | Input / output | Documented fit |
|---|---|---|---|---|
| [Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/overview) | `claude-sonnet-5` | Legacy; still available | $2 / $10 | General coding and agent work; use 5.5 for new selection when available |
| [Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/overview) | `claude-sonnet-5-5` | Latest Sonnet | $2 / $10 | Fast, balanced everyday coding and agent work |
| [Claude Opus 5](https://platform.claude.com/docs/en/models/opus-5/overview) | `claude-opus-5` | Legacy; still available | $5 / $25 | Complex coding and reasoning; use 5.5 for new selection when available |
| [Claude Opus 5.5](https://platform.claude.com/docs/en/models/opus-5-5/overview) | `claude-opus-5-5` | Latest Opus | $4 / $20 | Long-running agentic coding and knowledge work |
| [Claude Fable 5](https://platform.claude.com/docs/en/models/fable-5/overview) | `claude-fable-5` | Legacy; still available | $10 / $50 | Demanding reasoning and long-horizon work; use 5.1 for new selection when available |
| [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) | `gpt-6-astra` | Current flagship | $10 / $50 | Hard end-to-end work, complex coding, reasoning, research, and computer use |
| [GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol) | `gpt-5.6-sol` | Previous generation | $4 / $20 | Complex professional work when this version is specifically required or available |
| [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol) | `gpt-6-sol` | Current balanced model | $2 / $10 | Complex coding and agentic workflows with cost balance |

Anthropic also lists [Claude Fable 5.1](https://platform.claude.com/docs/en/models/fable-5-1/overview) as the latest Fable at the same $10 / $50 base API rates. It is an optional current replacement for the specifically requested Fable 5, not a rename of it. [Anthropic's model overview](https://platform.claude.com/docs/en/models/overview) currently suggests Opus 5.5 for most workloads and Fable 5.1 when demanding long-horizon work needs more capability. [OpenAI's model catalog](https://developers.openai.com/api/docs/models) positions Astra for the hardest work and Sol for a balance of intelligence and cost.

## Planning guidance

| Complexity | Typical evidence | Starting points | Lower-cost option |
|---|---|---|---|
| Low | One area, 1–5 files, focused verification, no material contract or security change | Claude Sonnet 5.5 or GPT-6 Sol at low effort | Use an available smaller model after a focused spot-check; this snapshot does not price one |
| Medium | Multiple files or a bounded cross-area contract, integration tests | Claude Sonnet 5.5 or GPT-6 Sol at medium effort | GPT-6 Sol at low effort for well-specified steps |
| High | Broad cross-area work, migrations, permissions, hard debugging, or architecture-sensitive decisions | Claude Opus 5.5 or GPT-6 Astra | Claude Sonnet 5.5 or GPT-6 Sol with phased implementation and review |
| Exceptional | Very long-horizon work where stronger reasoning is justified by task-specific evaluation | Claude Fable 5.1 or GPT-6 Astra | Claude Opus 5.5 with smaller verified phases |

These are starting points, not claims that one provider beats another. For an explicitly required model, preserve that model. Check the models available in the current workspace before a handoff. Do not equate API token rates with a coding-agent subscription's cost per task; effort, output length, caching, and tool use affect actual spend.

## Freshness policy

If this snapshot is older than 45 days, label recommendations `snapshot-based` and recommend refreshing provider pages before a high-impact handoff. Recheck model status, prices, and workspace availability whenever they could change the recommendation.
