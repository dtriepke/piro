# NeuroLink Rebrand — Design System Specification

> **This document is the implementation authority for the NeuroLink visual rebrand.**
> It supersedes all color, typography, logo, and component token decisions from the v1 Clarity Care design.
>
> - **v1 visual reference (read-only):** `design-concept/` — Clarity Care, Framer export
> - **Status:** Approved — 2026-06-28
> - **Scope:** Full product rebrand with bounded UX structural updates

---

## 1. Brand Strategy

> *"It's not about making it prettier. It's about changing the feeling."*

### Emotional Direction

The v2 brand moves away from a clinical healthtech aesthetic toward warmth, trust, and emotional closeness. Every visual decision — color, type, image, motion — must ask: *does this feel like a person, or a product?*

| Dimension | Before — v1 Clarity Care | After — v2 NeuroLink |
|---|---|---|
| Feeling | Clinical, healthtech, emotional distance | Warmth, trust, emotional closeness |
| Visual language | Clean-tech, green-dominant palette | Intentional imperfection, editorial serif, documentary imagery |
| Identity | Generic healthcare SaaS | Neurodiversity-specific, human-first platform |
| Interactive primary | Dark green `#1C2706` | Mineral-blue `#3B6776` |
| Brand identity color | Dark green `#1C2706` | Purple `#776ABF` |
| Accent / seeker CTA | Bright lime `#90E300` | Warm lime `#CCE651` |
| Background | Light green `#F8FAF2` | Off-white `#F6F4EF` |

### Color Rationale

| Color | Why it was chosen |
|---|---|
| **Purple `#776ABF`** | Neurodiversity identity. Associated with ADHD and autism advocacy communities. Warm and human, not clinical. Used for brand identity, callout boxes, and neurodiversity badges — never for interactive controls. |
| **Mineral-blue `#3B6776`** | Depth and trust. Conveys professional credibility without sterility. The "dependable" tone — default interactive primary (`--primary`) and footer background. |
| **Off-white `#F6F4EF`** | Warm, restful page base. Replaces the light-green that read as clinical and saturated. |
| **Lime `#CCE651`** | High-energy signal color. Reserved exclusively for seeker-facing primary CTAs — its rarity makes it unmissable. |
| **Sage `#85B094`** | Calm, natural, grounding. Section tints and secondary accents only. Never clinical. |
| **Near-black `#2B2B2B`** | Softer than pure black. Body text that feels warm rather than harsh. |

### Typography Rationale

Satoshi is the system default — clean, functional, contemporary. Fraunces is introduced as a controlled editorial accent for warmth. Together they create deliberate contrast: Satoshi's objectivity paired with Fraunces' human presence, appearing only at moments that benefit from emotional weight.

> *"Typography can feel welcoming too. The goal is a system balanced between digital clarity and human warmth."*

Rules: Fraunces maximum 1–2 instances per page. Never in navigation, buttons, forms, or cards.

### UX Scope Boundaries

| Allowed | Not Allowed |
|---|---|
| ✅ Color, typography, imagery, spacing, motion updates | ❌ New routes |
| ✅ Light UX structural updates improving warmth, trust, clarity | ❌ New product features |
| ✅ Component variant changes | ❌ Backend or data-contract changes |
| ✅ Logo system migration | ❌ Items from AGENTS.md Out of Scope list |

---

## 2. Logo System Contract

### Asset Prerequisites — Hard Prerequisite for Sprint 1

All variants must be delivered by the designer and committed to `src/assets/brand/` before any logo-dependent implementation begins.

| Variant | File names | Used in |
|---|---|---|
| Signature (horizontal) | `logo-signature.svg`, `logo-signature@2x.png` | Header, footer, email, OG image |
| Symbol mark | `logo-symbol.svg`, `logo-symbol@2x.png` | Favicon, avatar, app icon, social profiles |
| Seal | `logo-seal.svg`, `logo-seal@2x.png` | Trust certificates, verification stamps |
| Monochrome dark | `logo-signature-dark.svg` | Print, constrained single-color contexts |
| Monochrome light | `logo-signature-light.svg` | Dark backgrounds requiring white wordmark |

### Visual Identity

- **Symbol:** Stylized neuron suggesting human connection and support network
- **Wordmark:** "neuro" in purple `#776ABF` (Satoshi), "link" in green `#079494` (italic/script style)
- **Logo symbol:** Green `#079494` as primary color, purple `#776ABF` nodes

### Canonical Logo Component

- **Location:** `src/components/ui/logo.tsx`
- **API:**
  ```tsx
  <Logo variant="signature" | "symbol" | "seal" size="sm" | "md" | "lg" colorScheme="default" | "light" | "dark" />
  ```
- All layout components (Header, Footer, auth pages) **must use this component** — no raw `<img src="logo..." />` in layout code

### Logo Usage Rules

| Context | Rule |
|---|---|
| Approved backgrounds | Off-white, white, mineral-blue, near-black |
| Forbidden backgrounds | Purple, lime, sage |
| Minimum clear-space | Equal to the height of the "n" in the wordmark on all four sides |
| Forbidden modifications | Do not stretch, recolor, or separate symbol from wordmark except in approved symbol-only contexts |

---

## 3. Color System

### Brand Palette

| Token name | Hex | HSL (approx.) | Role |
|---|---|---|---|
| `off-white` | `#F6F4EF` | `40 20% 95%` | Background base — replaces light-green globally |
| `purple` | `#776ABF` | `250 38% 58%` | Brand primary, neurodiversity identity, callout boxes |
| `mineral-blue` | `#3B6776` | `195 33% 35%` | Depth, trust, footer background, specialist CTAs |
| `near-black` | `#2B2B2B` | `0 0% 17%` | Body text, high contrast, structural darks |
| `lime` | `#CCE651` | `72 74% 61%` | Primary seeker CTAs, emphasis |
| `sage` | `#85B094` | `139 22% 60%` | Secondary highlights, calm accents, section tints |
| `green` | `#079494` | `180 91% 30%` | Logo symbol only — no UI usage beyond logo component |

### CSS Variable Migration (`src/index.css`)

Replace all variables in `:root` with:

```css
:root {
  /* NeuroLink v2 palette */
  --background:      40 20% 95%;    /* off-white #F6F4EF */
  --foreground:       0  0% 17%;    /* near-black #2B2B2B */

  --card:             0  0% 100%;   /* white — elevated cards */
  --card-foreground:  0  0% 17%;

  --popover:          0  0% 100%;
  --popover-foreground: 0 0% 17%;

  --primary:        195 33% 35%;    /* mineral-blue #3B6776 — interactive primary */
  --primary-foreground: 0 0% 100%; /* white */

  --secondary:      139 22% 60%;    /* sage #85B094 */
  --secondary-foreground: 0 0% 17%;

  --muted:           40 15% 88%;    /* warm off-white tint */
  --muted-foreground: 0  0% 40%;

  --accent:          72 74% 61%;    /* lime #CCE651 */
  --accent-foreground: 0 0% 17%;

  --destructive:      0 72% 51%;
  --destructive-foreground: 0 0% 100%;

  --border:           0  0% 88%;
  --input:            0  0% 85%;
  --ring:           250 38% 58%;    /* purple for focus rings */

  --radius: 1rem;

  /* Named brand tokens */
  --purple:         250 38% 58%;    /* #776ABF */
  --mineral-blue:   195 33% 35%;    /* #3B6776 */
  --near-black:       0  0% 17%;    /* #2B2B2B */
  --lime:            72 74% 61%;    /* #CCE651 */
  --sage:           139 22% 60%;    /* #85B094 */
  --brand-green:    180 91% 30%;    /* #079494 — logo symbol only */
  --off-white:       40 20% 95%;    /* #F6F4EF */

  /* Semantic surface tokens */
  --surface-base:     var(--background);
  --surface-card:     0 0% 100%;
  --surface-subtle:   var(--muted);
  --surface-trust:    var(--mineral-blue);   /* footer, specialist sections */

  /* Retired v1 tokens — remove these */
  /* --dark-green, --light-green, --soft-green, --hover-color, --nl-blue, --nl-black */
  /* --nl-white-40, --trust-badge, --premium-badge, --surface-light, --surface-soft */
}
```

### Tailwind Color Token Updates (`tailwind.config.ts`)

```ts
colors: {
  // ... shadcn semantic tokens (unchanged structure, values update via CSS vars)
  "nl-purple":      "hsl(var(--purple))",
  "nl-mineral":     "hsl(var(--mineral-blue))",
  "nl-near-black":  "hsl(var(--near-black))",
  "nl-lime":        "hsl(var(--lime))",
  "nl-sage":        "hsl(var(--sage))",
  "nl-brand-green": "hsl(var(--brand-green))",
  "nl-off-white":   "hsl(var(--off-white))",

  // Retire: nl-green, nl-light, nl-soft (replace usages before removing)
}
```

### WCAG Contrast Matrix

| Foreground | Background | Ratio | Rating | Verdict |
|---|---|---|---|---|
| near-black `#2B2B2B` | off-white `#F6F4EF` | 12.88:1 | AAA | ✅ Approved |
| mineral-blue `#3B6776` | off-white `#F6F4EF` | 8.07:1 | AAA | ✅ Approved |
| white `#FFFFFF` | mineral-blue `#3B6776` | 8.87:1 | AAA | ✅ Approved |
| near-black `#2B2B2B` | lime `#CCE651` | 10.12:1 | AAA | ✅ Approved |
| white `#FFFFFF` | purple `#776ABF` | 4.57:1 | AA | ✅ Approved |
| near-black `#2B2B2B` | sage `#85B094` | 5.82:1 | AA | ✅ Approved |
| mineral-blue `#3B6776` | sage `#85B094` | 3.65:1 | Large text only | ⚠️ Restricted |
| lime `#CCE651` | purple `#776ABF` | 3.26:1 | Large text only | ⚠️ Restricted |
| white `#FFFFFF` | sage `#85B094` | 2.43:1 | Fails all | ❌ Forbidden |
| white `#FFFFFF` | lime `#CCE651` | 1.40:1 | Fails all | ❌ Forbidden |

### Purple Usage Rules

| Context | Allowed |
|---|---|
| Callout/feature card background tint | ✅ `bg-nl-purple/15` or `bg-nl-purple/20` |
| Icon container fill | ✅ `bg-nl-purple` with white icon |
| Neurodiversity identity badges/tags | ✅ `bg-nl-purple text-white` (AA: 4.57:1) |
| Emphasis text inside purple-tinted sections | ✅ `text-nl-purple` on white/off-white bg inside tinted card |
| Button background | ❌ Never — insufficient contrast for standard text |
| Body text on plain off-white | ❌ Never — use near-black instead |

### Sage Usage Rules

| Context | Allowed |
|---|---|
| Section background tints | ✅ `bg-nl-sage/20` |
| Subtle border accents | ✅ |
| near-black or mineral-blue text on sage | ✅ AA approved |
| White text on sage | ❌ Never — fails WCAG (2.43:1) |

---

## 4. Typography System

### Font Stack

| Font | Role | Source | When to use |
|---|---|---|---|
| **Satoshi** | System default — all UI | Fontshare (existing `<link>`) | Navigation, body, labels, buttons, forms, cards, UI components |
| **Fraunces** | Editorial accent — display headlines only | Google Fonts (add to `index.html`) | Hero H1, selected section openers, emotional anchors |
| **Inter** | Body fallback | Google Fonts (existing `<link>`) | Fallback only — not primary |

### Font Loading Addition (`index.html`)

Add after the existing Inter `<link>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&display=swap" rel="stylesheet" />
```

### Tailwind Font Family (`tailwind.config.ts`)

```ts
fontFamily: {
  sans:      ['Inter', 'sans-serif'],       // body fallback (unchanged)
  display:   ['Satoshi', 'sans-serif'],     // UI default (unchanged)
  editorial: ['Fraunces', 'serif'],         // NEW — editorial headlines only
}
```

### Typography Utility Classes (`src/index.css`)

Keep `.text-h1` through `.text-h6` as Satoshi (UI default — unchanged).

Add editorial variants:
```css
/* Editorial headline — Fraunces upright (default), hero H1 level */
.text-display-editorial {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 400;
  line-height: 1.1;
}

/* Editorial headline — italic modifier for pull-quote moments only */
.text-display-editorial-italic {
  font-family: 'Fraunces', serif;
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 400;
  line-height: 1.1;
  font-style: italic;
}

/* Editorial section opener — Fraunces, H2 level */
.text-h2-editorial {
  font-family: 'Fraunces', serif;
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 400;
  line-height: 1.15;
}
```

### Typography Rules (Code-Enforced)

| Rule | Enforcement |
|---|---|
| Satoshi is default for everything | `body` font-family stays Satoshi/display |
| Fraunces max 1–2 instances per page | Only `.text-display-editorial` and `.text-h2-editorial` expose Fraunces. No other utility class uses `font-editorial`. |
| Fraunces never in UI components | `font-editorial` / `font-family: Fraunces` not used inside `Button`, `Input`, `Select`, `Badge`, `NavigationMenu`, `Card` |
| Fraunces never in forms or nav | Component heading prop accepts `variant: "ui" \| "editorial"` — editorial disabled in functional flows |

### Example Approved Fraunces Placements

```
Hero H1:       "Trust that builds connection."          → .text-display-editorial
Section H2:    "Care and technology for better decisions." → .text-h2-editorial
```

```
Nav links:     Satoshi Medium 14px                      → font-display
Body copy:     Satoshi Regular 16px                     → font-display
Button label:  "Find my ideal specialist" (Satoshi)     → font-display
Card title:    Satoshi Medium                           → font-display
```

---

## 5. Button System

### Approved Variants (`src/components/ui/button.tsx`)

| Variant | Background | Text | Contrast | WCAG | Use case |
|---|---|---|---|---|---|
| `primary` | lime `#CCE651` | near-black `#2B2B2B` | 10.12:1 | ✅ AAA | Seeker CTAs: "Find My Match", "Start Guided Matching" |
| `specialist` | mineral-blue `#3B6776` | white `#FFFFFF` | 8.87:1 | ✅ AAA | Specialist CTAs: "Join as Specialist", "Create Profile" |
| `outline` | white/transparent | near-black `#2B2B2B` | 12.88:1 | ✅ AAA | Secondary: "Browse Specialists", "Learn More" |
| `ghost` | transparent | near-black `#2B2B2B` | — | — | In-page contextual text actions |
| `destructive` | red | white | — | — | Destructive actions (unchanged) |

> **Nav "Log In" is a plain `<Link>` with `text-sm font-medium` styling — not a `<Button>` component.** The header nav uses a styled anchor, not any Button variant, for the login link.

### Variant Migration from v1

| v1 Variant | v2 Replacement |
|---|---|
| `lime` | `primary` (same lime color, updated hex to `#CCE651`) |
| `default` (dark-green) | `specialist` (mineral-blue) |
| `white` | `outline` |
| `secondary` | Retire or merge into `outline` |

### Forbidden Combinations (Never expose in component API)

- ❌ `white` text + `lime` background — 1.40:1, fails all WCAG
- ❌ `white` text + `sage` background — 2.43:1, fails all WCAG
- ❌ `purple` as any button background — low contrast for standard labels
- ❌ Lime used decoratively — reserved for primary seeker actions only

---

## 6. Surface Tokens and Component Governance

### Named Surface Utilities (`src/index.css`)

```css
/* Replace old surface utilities */
.bg-surface-base    { background-color: hsl(var(--background)); }      /* off-white */
.bg-surface-card    { background-color: hsl(0 0% 100%); }              /* white */
.bg-surface-subtle  { background-color: hsl(var(--muted)); }           /* warm tint */
.bg-surface-brand   { background-color: hsl(var(--purple) / 0.12); }   /* purple callout tint */
.bg-surface-trust   { background-color: hsl(var(--mineral-blue)); }    /* footer / specialist dark */
```

> **Footer implementation note:** The current `Footer` component uses `className="bg-foreground"`. Since `--foreground` changes to near-black `#2B2B2B` in v2, the footer **must** use `bg-nl-mineral` explicitly — this is a required class change, not automatic from token inheritance.

### Trust Badge Token

Map `--trust-badge` to mineral-blue in v2:

```css
--trust-badge: var(--mineral-blue);  /* was: dark-green v1 */
```

Approved usage: `<CheckCircle2 className="trust-badge" />` on verified specialist profiles.

### Plan Tier Badge Colors

`PlanTierBadge` (`src/components/specialist/PlanTierBadge.tsx`) currently uses hardcoded Tailwind colors. Update to v2 brand tokens:

| Tier | v1 classes | v2 classes |
|---|---|---|
| `pro` | `bg-blue-100 text-blue-700` | `bg-nl-mineral/10 text-nl-mineral` |
| `premium` | `bg-purple-100 text-purple-700` | `bg-nl-purple/10 text-nl-purple` |
| `elite` | `bg-amber-100 text-amber-700` | `bg-nl-lime/20 text-nl-near-black` |
| `free` | hidden | unchanged |

### Hero Gradient Update

```css
.hero-gradient {
  background: linear-gradient(
    135deg,
    hsl(var(--off-white)) 0%,
    hsl(var(--sage) / 0.15) 100%
  );
}
```

---

## 7. Image System

### Brand Direction

- Style: contemporary documentary editorial
- Qualities: natural light, subtle grain, human framing, controlled imperfection
- Focus: connection, listening, presence, trust, joy, acceptance

### Approved vs. Forbidden

| ✅ Approved | ❌ Forbidden |
|---|---|
| Warm human moments — connection, listening | Distress as primary subject |
| Genuine emotion, candid framing | Obvious stock poses or forced smiles |
| Natural environments and light | Clinical/sterile settings, white coats + equipment-heavy |
| Subtle grain and imperfection | Over-processed, over-lit images |

### Current Asset Status

| Asset | Status | Direction |
|---|---|---|
| `hero-background.png` | ✅ Replaced (v2) | Parent and child sharing a warm embrace on a couch — warm connection scene |
| `service-section.png` | ✅ Replaced (v2) | Specialist supporting a neurodivergent client wearing noise-cancelling headphones — genuine mentoring moment |
| `our-approach.png` | ✅ Replaced (v2) | Pediatric specialist and young patient sharing a fist bump — trust and verification theme |
| `benefit-section.png` | ✅ Replaced (v2) | Father and son reading together at home — family benefit theme |
| `contact-section.png` | ✅ Replaced (v2) | Parent and child with a trusted daily-life provider during a haircut — warm, approachable moment |
| `ruthie.png` | ✅ Keep | Real person — do not replace |
| `dennis.png` | ✅ Keep | Real person — do not replace |

> Imagery sprint completed (rebrand-09). All five section images were replaced with v2 documentary-style photography sourced from `design-concept/images/foto-neurolink*.png`.

---

## 8. Motion System

### Principles

- Restrained and purposeful — conveys trust, not delight
- "Intentional imperfection" applies to **imagery**, not UI animation
- No looping, bouncing, or attention-grabbing motion

### Updated Keyframe (`src/index.css`)

```css
@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(16px);
    filter: blur(2px);   /* reduced from 4px — more organic, less clinical */
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
}
```

### Framer Motion Config — Keep As-Is

```ts
// Warm ease — unchanged
transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}

// Scroll trigger — unchanged
useInView(ref, { once: true, margin: "-60px" })
```

---

## 9. Design Concept Folder — v1 Legacy Reference

> The `design-concept/` folder contains the Framer export of **Clarity Care** — the v1 brand.
> It is **read-only** and represents the superseded design system.
> **This file (`brand-system.md`) is the implementation authority for all brand decisions.**

### What Carries Over from v1

| v1 Element | Status |
|---|---|
| Component inventory (17 components) | ✅ Use as structural reference |
| Page section order (hero → stats → why-us → services → approach → benefit → reviews → team → FAQ → contact) | ✅ Preserved |
| Responsive breakpoint patterns | ✅ Preserved |
| Spacing/padding patterns in sections | ✅ Preserved |
| Border-radius tokens: `pill` 60px, `card` 16px, `tag` 24px | ✅ Unchanged |

### What Is Replaced

| v1 Element | v2 Replacement |
|---|---|
| Dark green `#1C2706` (primary) | Mineral-blue `#3B6776` (interactive primary) + Purple `#776ABF` (brand identity) |
| Light green `#F8FAF2` (background) | Off-white `#F6F4EF` |
| Soft green `#D5DEE5` | Warm off-white muted tint |
| Bright lime `#90E300` | Warm lime `#CCE651` |
| Blue `#2467E3` | Mineral-blue `#3B6776` |
| Dark green text | Near-black `#2B2B2B` |
| Satoshi-only typography | Satoshi (UI) + Fraunces (editorial headlines) |
| Old logo/mark | New neuron-symbol logo system |
| Green-palette imagery | Documentary editorial imagery |

---

## 10. Enforcement Matrix

| Rule | Code Artifact | Method |
|---|---|---|
| Color tokens | `src/index.css` `:root` | CSS custom properties — single source of truth |
| Tailwind color names | `tailwind.config.ts` | Named tokens only — no raw hex in component classes |
| Button forbidden combos | `src/components/ui/button.tsx` | CVA variants — invalid pairings never exposed |
| Fraunces scope | `src/index.css` | Only `.text-display-editorial` and `.text-h2-editorial` use `font-editorial` |
| Logo rendering | `src/components/ui/logo.tsx` | All layout imports from this component |
| Purple not in buttons | `button.tsx` CVA | No `purple` variant defined |
| White on lime/sage | Component API | No variant produces this combination |
| Max 2 Fraunces per page | PR checklist | Code review gate |
| New image additions | Designer approval | Review checklist on any PR adding imagery |
| `trust-badge` token | `src/index.css` | Maps to `--mineral-blue` in v2 |
| `PlanTierBadge` component | `src/components/specialist/PlanTierBadge.tsx` | Remapped to `nl-mineral`, `nl-purple`, `nl-lime` variants |
| Nav "Log In" link | `src/components/layout/Header.tsx` | Plain `<Link>` with text styling — not a `<Button>` component |
| Footer background | `src/components/layout/Footer.tsx` | Must use `bg-nl-mineral` explicitly — not `bg-foreground` |

---

## 11. Rebrand Issue Map

### Tier 1 — Brand Foundation (no dependencies)

| Issue | Scope |
|---|---|
| 1.1 | CSS token migration: update `:root` in `index.css` + Tailwind color map |
| 1.2 | Fraunces font loading: add `<link>` to `index.html` + `font-editorial` class |
| 1.3 | Editorial typography utilities: `.text-display-editorial`, `.text-h2-editorial` |
| 1.4 | Button component rebrand: new `primary`, `specialist`, `outline` variants |
| 1.5 | Tag component rebrand |
| 1.6 | Canonical logo component: `src/components/ui/logo.tsx` + favicon update |
| 1.7 | Header rebrand: off-white bg, new logo, mineral-blue specialist CTA |
| 1.8 | Footer rebrand: mineral-blue bg, new logo |

### Tier 2 — Marketing Surfaces (depends on Tier 1)

| Issue | Scope |
|---|---|
| 2.1 | Landing page `/` full rebrand |
| 2.2 | For Specialists page `/for-specialists` |
| 2.3 | Login page `/login` |

### Tier 3 — Product Flows (depends on Tier 1)

| Issue | Scope |
|---|---|
| 3.1 | Search page + `FilterPanel` + `SpecialistCard` |
| 3.2 | Specialist profile page `/specialists/:slug` |
| 3.3 | Seeker onboarding flow `/onboarding` |
| 3.4 | Onboarding results `/onboarding/results` |

### Tier 4 — Utility / Hub (depends on Tier 1)

| Issue | Scope |
|---|---|
| 4.1 | User profile hub `/profile` |
| 4.2 | Specialist onboarding + Provider onboarding |
| 4.3 | `ServiceGroupPage` + `ConditionGroupPage` |

### Tier 5 — Imagery (blocked: waiting for designer assets)

| Issue | Scope |
|---|---|
| 5.1 | Replace hero + section images across all pages (placeholder state ships first) |

---

*Last updated: 2026-06-27 | Status: Approved — ready for sprint decomposition*
