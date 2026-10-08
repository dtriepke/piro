# DESIGN.md — NeuroLink Visual Design Reference

> **Maintained by the `piro-ux-designer` agent.**
> This is the living visual design authority for the NeuroLink v2 implementation.  
> Full specification: `.github/design/brand-system.md`  
> Legacy v1 reference (read-only): `design-concept/`

---

## Color Tokens (v2)

| Token | Hex | CSS Variable | Role |
|---|---|---|---|
| off-white | `#F6F4EF` | `--off-white` | Background base |
| purple | `#776ABF` | `--purple` | Brand primary, neurodiversity identity |
| mineral-blue | `#3B6776` | `--mineral-blue` | Trust, depth, footer, specialist CTAs |
| near-black | `#2B2B2B` | `--near-black` | Body text, structural darks |
| lime | `#CCE651` | `--lime` | Primary seeker CTAs only |
| sage | `#85B094` | `--sage` | Secondary highlights, calm accents |
| brand-green | `#079494` | `--brand-green` | Logo symbol only — no UI use |

### Forbidden Combinations

| Foreground | Background | Reason |
|---|---|---|
| white | lime | Fails WCAG (1.40:1) |
| white | sage | Fails WCAG (2.43:1) |
| purple | any bg | Not approved as button background |
| lime | decorative use | Reserved for primary CTA only |

---

## Typography

| Font | Role | Tailwind Class |
|---|---|---|
| Satoshi | All UI — default | `font-display` |
| Fraunces | Editorial headlines only (hero H1, section H2) | `font-editorial` |
| Inter | Body fallback | `font-sans` |

### Utility Classes

| Class | Usage |
|---|---|
| `.text-display-editorial` | Hero H1 — Fraunces, ~4.25rem, italic |
| `.text-h2-editorial` | Section opener — Fraunces, ~3.25rem |
| `.text-h1` → `.text-h6` | All other headings — Satoshi |

**Rules:**
- Fraunces max 1–2 instances per page.
- Never use `font-editorial` inside buttons, inputs, nav, cards, or any functional UI component.

---

## Buttons

| Variant | Background | Text | Use |
|---|---|---|---|
| `primary` | lime `#CCE651` | near-black | Seeker CTAs |
| `specialist` | mineral-blue `#3B6776` | white | Specialist CTAs |
| `outline` | transparent | near-black | Secondary actions |
| `ghost` | transparent | near-black | Nav text links |

---

## Border Radius Tokens

| Token | Value | Use |
|---|---|---|
| `rounded-pill` | 60px | Full-pill badges, tag chips |
| `rounded-card` | 16px | Content cards |
| `rounded-tag` | 24px | Category tags |

---

## Surfaces

| Utility | Token | Use |
|---|---|---|
| `.bg-surface-base` | off-white | Page background |
| `.bg-surface-card` | white | Elevated cards |
| `.bg-surface-subtle` | warm muted tint | Section tints |
| `.bg-surface-brand` | purple/12% | Callout boxes |
| `.bg-surface-trust` | mineral-blue | Footer, specialist sections |

---

## Logo

Component: `src/components/ui/logo.tsx`  
API: `<Logo variant="signature|symbol|seal" size="sm|md|lg" colorScheme="default|light|dark" />`

Never use raw `<img src="logo..." />` in layout code.  
Forbidden backgrounds for logo: purple, lime, sage.

---

## Imagery Direction

- Style: documentary editorial, natural light, subtle grain
- Subject: human connection, listening, presence, acceptance
- Forbidden: clinical settings, white coats, obvious stock poses, over-processed images
