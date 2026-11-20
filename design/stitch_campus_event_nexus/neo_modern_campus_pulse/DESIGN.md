---
name: Neo-Modern Campus Pulse
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#95002b'
  on-tertiary: '#ffffff'
  tertiary-container: '#bf0f3c'
  on-tertiary-container: '#ffd0d2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a high-energy, contemporary digital environment tailored for collegiate discovery, campus life immersion, and high-frequency engagement. Built for an active student ecosystem—spanning undergraduate club seekers, Greek life coordinators, departmental faculty, and campus administrators—the visual language merges modern digital aesthetics with structural utility.

The emotional core is optimistic, social, and reliable. The interface avoids bureaucratic academic dryness, replacing it with kinetic micro-interactions, vivid chromatic contrast, and focused content hierarchy. Structural clarity supports fast decision-making during registration rushes, while soft luminescence and rich container surfaces cultivate high daily retention.

## Colors

The color palette centers on a commanding deep indigo (`#4F46E5`) paired with an electric violet tint (`#6366F1`) for primary actions, navigational hierarchy, and brand anchors. 

- **Primary (`#4F46E5` / `#6366F1`):** Applied to active navigation indicators, key registration buttons, interactive card states, and focus triggers.
- **Secondary Accent (`#F59E0B`):** Warm amber applied to urgent calls to action, capacity warnings (e.g., "Only 5 seats left"), and high-visibility discovery badges.
- **Tertiary Accent (`#F43F5E`):** Vivid coral reserved for live event indicators, critical alerts, saved favorites, and high-interest status highlights.
- **Neutral Palette:** Anchored by crisp slate tones ranging from deep charcoal (`#0F172A`) for primary typographic content to soft off-white surface layers (`#F8FAFC`, `#FFFFFF`) that isolate information without visual fatigue.
- **Role Accents:** Role badges use contextual tinting—Student (Indigo 50/700), Organizer (Amber 50/700), Admin (Coral 50/700).

## Typography

The typographic hierarchy combines the contemporary warmth and structural geometric rhythm of Plus Jakarta Sans for titles and dynamic branding with the functional legibility of Inter for body text, data points, and interface labels.

- **Headlines & Display:** Plus Jakarta Sans is rendered with tight letter spacing and prominent weights (600–800) to convey authority, dynamism, and modern presence across screen sizes.
- **Body & Metadata:** Inter guarantees structural legibility inside data grids, time markers, attendee headcounts, and registration forms.
- **Numeric & Category Badges:** Rendered in `label-sm` or `label-md` with strict tracking adjustments to ensure instant scanning on condensed mobile screens.

## Layout & Spacing

The layout adheres to a flexible 12-column responsive grid on desktop (max content container of 1280px) and collapses to a 4-column layout on mobile devices.

- **Desktop (1024px+):** Employs a 12-column layout with 24px (`1.5rem`) gutters and 32px (`2rem`) outer margins. Multi-column event dashboards, calendar timelines, and filtering sidebars span cleanly across 3, 4, 8, or 12 columns.
- **Tablet (768px - 1023px):** Adapts to an 8-column layout with 16px gutters; side panels convert to sliding drawers or stacked filter strips.
- **Mobile (< 768px):** Collapses to 4 columns with 16px (`1rem`) gutters and 16px margins. Event cards transition into vertical single-column full-width feeds with sticky bottom booking and RSVP actions.

## Elevation & Depth

Visual depth is achieved through refined tonal layering complemented by subtle ambient luminescence and crisp hairline borders rather than heavy, muddy drop shadows.

- **Surface Levels:** 
  - Base canvas uses clean neutral slate (`#F8FAFC`).
  - Cards, panels, and modals rest on elevated pure white surfaces (`#FFFFFF`).
  - Active overlays and hovering items use elevated containers with subtle border highlights (`rgba(99, 102, 241, 0.15)`).
- **Ambient Shadows:** Shadows are lightweight and diffused, tinted with primary slate pigments:
  - Low elevation (cards, resting state): `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
  - Mid elevation (hover states, dropdown menus): `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
  - High elevation (modals, slide-out draw sheets): `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Glow Accents:** High-priority cards (featured campus events, live registrations) feature a soft exterior glow: `0 0 20px -5px rgba(99, 102, 241, 0.25)`.
- **Hairline Borders:** Containers leverage a 1px border (`#E2E8F0` or `rgba(226, 232, 240, 0.8)`) to maintain razor-sharp separation across all screen resolutions.

## Shapes

The design system employs a Level 2 (Rounded) geometry balanced by full-pill status indicators:

- **Cards, Panels, and Containers:** Built using `1rem` (16px) radius for consistent visual softness.
- **Buttons and Inputs:** Utilize `0.5rem` (8px) radius for precise touch targets and distinct boundaries.
- **Category Chips, Status Indicators, and Role Badges:** Use full-radius pill styling (`9999px`) to immediately differentiate taxonomy labels from clickable interactive blocks.

## Components

### Buttons
- **Primary:** Solid indigo background (`#4F46E5`), white text, `0.5rem` radius, bold label typography. Subtle upward translate (-1px) and soft indigo shadow on hover.
- **Secondary:** Surface white background with a 1px border (`#E2E8F0`), neutral dark text (`#0F172A`). Transitions to slate background on hover.
- **Accent / RSVP:** Electric amber (`#F59E0B`) or coral (`#F43F5E`) fill used exclusively for rapid RSVP triggers, ticket claims, or urgency triggers.

### Chips & Badges
- **Pill Badges:** Fully rounded (`rounded-full`), padded (`0.25rem 0.75rem`), with uppercase bold typography (`label-sm`).
- **Category Chips:** Light tinted background matching category color (e.g., Violet for Academic, Amber for Social, Coral for Greek Life) with contrasting high-contrast text.
- **Role Indicators:** 
  - *Student:* Violet tint (`#EEF2FF` background, `#4338CA` text).
  - *Organizer:* Amber tint (`#FEF3C7` background, `#B45309` text).
  - *Admin:* Slate tint (`#F1F5F9` background, `#334155` text) with a subtle lock or crown icon.

### Event Cards
- Built on white surface backgrounds with a 1px slate border (`#E2E8F0`).
- Features a structured vertical hierarchy: date chip overlay, high-contrast title, organizer metadata row with mini avatar, capacity progress bar, and action CTA.
- Hover states include a card scale translation (-2px) and faint glow outline.

### Input Fields & Controls
- Form controls use a crisp `0.5rem` radius, 1px border (`#CBD5E1`), and soft neutral placeholder text.
- Focus rings trigger an indigo outline ring (`2px solid rgba(99, 102, 241, 0.35)`) and border color transition to `#4F46E5`.
- Checkboxes and radios display custom rounded-md and rounded-full styles with indigo fill on selection.

### Tables & Data Grids (Admin / Organizer Views)
- Header rows utilize muted slate-tinted backgrounds with uppercase small-label headings.
- Clean 1px horizontal dividers between rows; hover states highlight the entire row with a slate/indigo light wash.