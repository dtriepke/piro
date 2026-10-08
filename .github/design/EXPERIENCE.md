# EXPERIENCE.md — NeuroLink Behavioral UX Reference

> **Maintained by the `piro-ux-designer` agent.**
> This is the living behavioral UX authority for NeuroLink.  
> Visual tokens and component specs: `DESIGN.md`  
> Full brand spec: `.github/design/brand-system.md`

---

## Core UX Principles

| Principle | What it means |
|---|---|
| **Warmth over polish** | Emotional closeness beats clean-tech sterility. Prefer human language, gentle transitions. |
| **Trust signals first** | Verification badges, plain-language copy, and visible credentials reduce anxiety before the ask. |
| **One primary action** | Each screen has one clearly dominant CTA. Secondary actions are visually subordinate. |
| **Seeker autonomy** | Flows feel guiding, not controlling. Every step discloses what happens next. |
| **Low cognitive load** | Short labels, chunked steps, progressive disclosure. Never front-load all decisions. |
| **Inclusive by default** | WCAG 2.1 AA contrast, keyboard navigation, semantic HTML intent, visible focus states. |

---

## Interaction Patterns

### Navigation

- Active nav link: underline or `text-nl-purple`, not bold alone.
- Mobile menu: full-screen overlay, close button top-right, focus trap.
- Keyboard: `Tab` moves through links in DOM order; `Esc` closes overlays.

### Buttons and CTAs

- Primary CTA (lime): exactly one per screen/section. Never duplicated at equal weight.
- Specialist CTA (mineral-blue): used on pages targeting providers.
- Ghost / outline: secondary and tertiary actions.
- Loading state: spinner + disabled, label changes to present-progressive (e.g., "Searching…").
- Disabled state: 40% opacity, `cursor-not-allowed`, tooltip explaining why if non-obvious.

### Forms

- Label above input, always visible (never placeholder-only).
- Inline validation: show error on blur, not on keystroke.
- Error messages: below the input, `text-destructive`, prefixed with an icon.
- Required indicator: asterisk `*` after label, with `aria-required`.
- Progress: multi-step flows show a step indicator (stepper or progress bar) above the form.

### Cards

- Hover: subtle elevation (`shadow-md`) + border color shift to `nl-purple/30` or `nl-mineral`.
- Focus (keyboard): visible `ring-2 ring-nl-purple` outline.
- Click target: entire card area is interactive when the card is a link.

### Modals and Overlays

- Open: fade-in + scale-up (120ms ease-out).
- Close: fade-out (80ms ease-in).
- Backdrop: semi-transparent near-black `bg-near-black/50`.
- Focus trap: active while open. `Esc` closes.
- Scroll lock: body scroll locked while modal is open.

### Toast Notifications

- Position: bottom-right on desktop, bottom-center on mobile.
- Duration: 4s for info/success; 8s for errors (with manual dismiss).
- Do not stack more than 3 toasts.

---

## Onboarding Flow (Seeker)

- Persona selection is the first step — no assumption about the user's role.
- Progress is shown at the top of each step.
- Each question has a clear headline and optional sub-copy that explains why it's asked.
- "Back" is always available and never loses answered data.
- Summary screen discloses the profile transfer behavior before account creation.
- Guest path: full flow available without login; nudge to create account at summary.

---

## Search and Discovery

- Filter panel: persistent on desktop (left sidebar), sheet/drawer on mobile.
- Applied filters shown as dismissible tags above results.
- Empty state: explains why (no results for X) + offers filter expansion suggestions.
- Result card: photo, name, specialty, trust signal, price range, CTA — in that order.
- Ranking disclosure: "Results ranked by tier" shown as a quiet footnote, not hidden.

---

## Specialist Profile (Public)

- Trust signals (verification badge, license, org) appear in the first viewport.
- Contact CTA is sticky on mobile (bottom bar) once the user scrolls past the hero.
- "Why this specialist" rationale bullets (from onboarding match) shown inline if available.
- Profile sections ordered: Hero → Trust → Specializations → Services → About → Contact.

---

## Empty States

Every empty state must have:
1. An icon or illustration (not just text).
2. A plain-language explanation of what's missing and why.
3. A single action to resolve it (or a link to where to go).

---

## Error States

| Type | Treatment |
|---|---|
| Form field error | Inline, below input, `text-destructive` |
| Page-level error | Full-width alert banner, near top of content area |
| Network error | Toast + retry action where applicable |
| 404 | Friendly page with nav back to home |

---

## Motion Guidelines

- Preference: opt-in to motion. Respect `prefers-reduced-motion`.
- Default transition: `duration-200 ease-out` for most UI state changes.
- Page transitions: subtle fade, not slides that could feel disorienting.
- Loading skeletons preferred over spinners for content-heavy sections.
- Celebratory animation (e.g., match success): one-shot, not looping.

---

## Accessibility Checklist (per screen)

- [ ] All interactive elements reachable by keyboard
- [ ] Focus styles visible and distinct (ring-2 ring-nl-purple)
- [ ] Images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Headings in correct hierarchical order (h1 → h2 → h3)
- [ ] Color contrast meets WCAG 2.1 AA for all text
- [ ] Form labels explicitly associated with inputs (`htmlFor` / `aria-labelledby`)
- [ ] Loading states announced to screen readers (`aria-live` or `role="status"`)
