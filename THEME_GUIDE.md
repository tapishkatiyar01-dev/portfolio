# Portfolio Theme Guide

This project separates **content** (stored in MongoDB) from **presentation** (each visual theme in `templates/<theme-name>/`). Themes are interchangeable skins over the same data contract. `portfolio-sample-data.json` is the local reference for that contract.

Use this guide when:

- **Adding a new theme** — create a self-contained folder and register it in `app/page.js`
- **Updating an existing theme** — change visuals, layout, and motion inside the theme folder only
- **Adding portfolio content** — update MongoDB / seed data, not theme code
- **Pagination** — every theme must page section records from the server; premium and sinematic also use client reveal

---

## Mental model

```
MongoDB
  → lib/portfolioRepository.js          (SSR: first 10 items per section + total/hasMore)
  → app/page.js                         (dynamic import of one theme)
  → templates/<theme>/components
       SectionTabs → LayoutRenderer
            ↓
       lib/usePaginatedSection.js       (client fetch of next pages)
            ↓
       GET /api/sections/[sectionId]/items?page=&limit=
```

1. `getPortfolioData()` loads `personal`, `socials`, `skills`, `Sections`, and **paginated** `data` from MongoDB.
2. `app/page.js` reads `template` and **dynamically imports** only that theme's `Layout`, `Hero`, and `SectionTabs`.
3. The selected theme receives the same props and renders everything.
4. When the user needs more records, the theme's `LayoutRenderer` calls the section items API (never query MongoDB from theme code).

---

## What must stay intact

These are the boundaries. Changing them affects every theme or breaks content portability.

### Do not change

| Area | Rule |
| --- | --- |
| `app/page.js` data wiring | Always pass the same props to `ThemeLayout`, `ThemeHero`, and `ThemeSections`. Do not add theme-specific data fetching here. |
| Dynamic imports | Load **only** the active theme. Never statically import all themes in one file — global CSS will bleed between themes. |
| `lib/portfolioRepository.js` | Single SSR data source. Themes must not query MongoDB directly. |
| Data contract shape | Top-level keys: `personal`, `socials`, `skills`, `Sections`, `data`. See [Data contract](#data-contract). |
| Paginated `data` entries | Each `data[sectionId]` is `{ items, total, hasMore }` — not a bare array. |
| Section resolution | Lookup key: `section['data-source'] \|\| section.id`. Pass `sectionId` (usually `section.id`) into pagination. |
| Layout renderer contract | Accept `sectionData`, `sectionId`, `layoutType`, `dataType`, `itemType` (and optionally `sectionName`). Use shared pagination hooks from `lib/`. |
| Theme isolation | Import only from your theme folder and `lib/`. Never import another theme's components, CSS, or motion helpers. |
| No hardcoded portfolio copy | Names, companies, dates, URLs, and project text must come from props / JSON — never from theme source code. |

### Safe to change (inside a theme folder)

- Visual design, typography, colors, spacing, animations
- Component structure and file organization (as long as entry components keep the same exports/props)
- CSS class naming (must stay theme-prefixed, e.g. `arcade-*`, `aesthetic-*`)
- Tab vs scroll section UX (premium scrolls all sections; arcade/asthetic use tabs — both are valid)
- Theme-specific UI primitives, motion config, and decorative assets
- How the "Show more" control looks (label, styling) — not the pagination rules themselves

### One registration point outside the theme folder

When adding a theme, you **must** add a branch in `app/page.js`:

```js
const template = ['premium', 'terminal', 'asthetic', 'stickynote', 'sinematic', 'arcade', 'kinetic', 'kineticstage', 'yourtheme']
  .includes(data.template) ? data.template : 'premium';
```

Unknown values fall back to `premium`.

---

## Supported themes

| Value | Folder | Pagination mode |
| --- | --- | --- |
| `premium` | `templates/premium` (default) | **Hybrid** — client reveal + server pages |
| `terminal` | `templates/terminal` | **Server only** |
| `asthetic` | `templates/asthetic` | **Server only** |
| `stickynote` | `templates/stickynote` | **Server only** |
| `sinematic` | `templates/sinematic` | **Hybrid** — client reveal + server pages |
| `arcade` | `templates/arcade` | **Server only** |
| `kinetic` | `templates/kinetic` | **Hybrid** — single-scroll planes |
| `kineticstage` | `templates/kineticstage` | **Server only** — section tabs + scene backdrop |

Set the active theme in MongoDB (`template` collection, `_id: "active"`) or in `portfolio-sample-data.json`:

```json
{ "template": "arcade" }
```

---

## Data contract

### Top-level shape

```json
{
  "template": "premium",
  "personal": {},
  "socials": {},
  "skills": [],
  "Sections": [],
  "data": {}
}
```

### `personal` — identity and hero

Used by `Layout`, `Hero`, `About`, and `Contact`.

| Field | Used for |
| --- | --- |
| `name` | Display name, monogram fallback |
| `designation` | Role / title |
| `headlines` | Rotating hero headlines (array of strings; `\|` for line breaks) |
| `email` | Contact |
| `resume` | Resume download link |
| `location` | Location label |
| `summary` | Short intro (hero / about) |
| `description` | Longer about text |
| `traits` | Trait chips or stat-like labels |
| `aboutKicker` | About section eyebrow (optional) |
| `Logo` | Logo / small avatar image |
| `Avatar` | Hero portrait (image or GIF) |
| `stats` | Optional `{ value, label }[]`; falls back to `traits` mapped as stats |
| `monogram`, `logoText` | Optional explicit monogram instead of deriving from `name` |

### `socials` — external links

```json
{
  "github": "https://github.com/...",
  "linkedin": "https://linkedin.com/in/...",
  "website": "https://..."
}
```

### `skills` — skill list

```json
[{ "name": "TypeScript", "level": "Advanced", "order": 1 }]
```

### `Sections` — dynamic section configuration

```json
{
  "id": "projects",
  "name": "Projects",
  "layout-type": "grid",
  "data-type": "project",
  "data-source": "projects"
}
```

| Field | Purpose |
| --- | --- |
| `id` | Stable section key; nav anchors; **pagination API path**; seed `_id` / `sectionId` |
| `name` | Display label in nav / tabs / headings |
| `layout-type` | Renderer: `grid`, `timeline`, `compact`, or `list` |
| `data-type` | Field mapping for each record (see below) |
| `data-source` | Optional key into `data`. Falls back to `id` |

### `data` — section records (runtime shape)

**In MongoDB / seed JSON**, each section document stores the full array:

```json
{
  "_id": "projects",
  "sectionId": "projects",
  "items": [ /* all records */ ]
}
```

**At runtime** (after `getPortfolioData()`), `data` is paginated:

```js
data[sectionId] = {
  items: [ /* first INITIAL_PAGE_SIZE (10) records */ ],
  total: 42,
  hasMore: true,
}
```

Themes must treat `data[source]` as this object (or normalize legacy arrays). Never assume a bare array.

`description` on a record may be a **string** or **array of strings**. Use `lib/DescriptionDisclosure` for multi-paragraph expandable text.

---

## Pagination (required for every theme)

### Server page size

| Constant | Value | Where |
| --- | --- | --- |
| `INITIAL_PAGE_SIZE` / `SERVER_PAGE_SIZE` | **10** | SSR slice + API page size |
| Hybrid client start | **`CLIENT_REVEAL_START`** (see `lib/usePaginatedSection.js`) | Premium / sinematic only |
| Hybrid client step | **`CLIENT_REVEAL_STEP`** (3) | Premium / sinematic only |

### API

```
GET /api/sections/[sectionId]/items?page=1&limit=10
```

Response:

```json
{
  "items": [],
  "total": 24,
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

Use `section.id` as `sectionId` (matches the `data` collection `sectionId` field from seed).

### Shared hooks — `lib/usePaginatedSection.js`

| Hook | Themes | Behavior |
| --- | --- | --- |
| `usePaginatedSection` | terminal, asthetic, stickynote, arcade, **kineticstage** | Show **all loaded** items. "Show more" fetches the next **10** from the API. |
| `useHybridPaginatedSection` | **premium**, **sinematic**, **kinetic** | Show **client reveal start** items first; each click reveals **+3**. When the UI needs more than what is loaded, fetch the next **10** from the API. When everything is visible → **Show less**. |

Do not reimplement fetch logic inside themes. Import the hooks from `lib/`.

### Wiring in `SectionTabs.jsx`

```js
function getSectionEntry(section, data) {
  const source = section['data-source'] || section.id;
  const entry = data[source];
  if (!entry) return { items: [], total: 0, hasMore: false };
  if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
  return {
    items: entry.items || [],
    total: entry.total ?? (entry.items || []).length,
    hasMore: entry.hasMore ?? false,
  };
}
```

```jsx
<LayoutRenderer
  sectionData={getSectionEntry(section, data)}
  sectionId={section.id}
  layoutType={section['layout-type']}
  dataType={section['data-type']}
  itemType={section['data-source'] || section['data-type']}
  sectionName={section.name}
/>
```

### Wiring in `layouts/LayoutRenderer.jsx`

**Server-only theme (example):**

```jsx
const { items, total, hasMore, loading, fetchMore } = usePaginatedSection({
  sectionData,
  sectionId,
});
// render layouts with `items`
// if hasMore → Show more button → fetchMore()
```

**Hybrid theme (premium / sinematic):**

```jsx
const {
  visibleItems, total, loading, allVisible, needsToggle, nextBatch, showMore, showLess,
} = useHybridPaginatedSection({ sectionData, sectionId });
// render layouts with `visibleItems`
// needsToggle → Show more / Show less
```

### Motion caveat when appending items

If a layout wraps rows in a Framer Motion **stagger parent** that already finished `whileInView`, newly fetched children can stay at `opacity: 0`.

Prefer:

```jsx
const ref = useRef(null);
const inView = useInView(ref, { once: true, amount: 0.02, margin: '0px 0px -8% 0px' });

<motion.div
  ref={ref}
  variants={stagger}
  initial="hidden"
  animate={inView ? 'visible' : 'hidden'}  // not only whileInView
>
```

Per-item `whileInView` is fine for timeline/compact; keep `amount` low (~0.05) and use `once: true`.

### Tall section window motion (terminal / asthetic)

Do **not** use large `amount` without `once` on a full-window wrapper. Tall timelines stay invisible until a big fraction is on screen, then open/close while scrolling.

Use:

```js
{ once: true, amount: 0.01, margin: '0px 0px -20% 0px' }
```

---

## Dynamic section behavior

### How sections flow from DB to UI

```
sections collection (ordered)     data collection (per sectionId, full items[])
         │                                    │
         └──────── getPortfolioData() ────────┘
                         │
         { Sections, data: { [id]: { items[0..9], total, hasMore } } }
                         │
                   SectionTabs.jsx
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
      About           Skills        LayoutRenderer
    (fixed)         (fixed)      (paginated layouts)
```

1. **Fixed sections** — Every theme includes `About`, `Skills`, and `Contact`. These are not in `Sections`.
2. **Dynamic sections** — `Sections` from the database becomes tabs, scroll sections, or nav items.
3. **Record lookup** — Always resolve via `data-source || id`, then normalize to `{ items, total, hasMore }`.

### Adding a new section (content only)

No theme code changes if layout utilities already handle the record shape.

**1. Add to `Sections` (seed / `sections` collection):**

```json
{
  "id": "certifications",
  "name": "Certifications",
  "layout-type": "grid",
  "data-type": "full",
  "data-source": "certifications"
}
```

**2. Add matching `data` document** (full `items` array; SSR still sends only the first 10):

```json
{
  "_id": "certifications",
  "sectionId": "certifications",
  "items": [
    {
      "title": "AWS Solutions Architect",
      "subtitle": "Amazon Web Services",
      "description": "Professional certification.",
      "date": "2024",
      "tags": ["Cloud"],
      "links": { "verify": "https://..." }
    }
  ]
}
```

**3. Seed and refresh:**

```bash
npm run db:seed
```

### Section navigation patterns

**Pattern A — Tabbed** (arcade, asthetic, terminal, stickynote)

```js
const tabs = [
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills' },
  ...Sections.map((s) => ({ id: s.id, name: s.name })),
  { id: 'contact', name: 'Contact' },
];
```

Theme-scoped nav event example:

```js
window.dispatchEvent(new CustomEvent('arcade:select-tab', { detail: sectionId }));
```

**Pattern B — Scroll / stacked** (premium, sinematic reel)

Render sections in one scrollable page (or cinematic scenes). Use `id` anchors for in-page navigation.

### `data-type` reference

| `data-type` | Title | Subtitle | Date | Tags |
| --- | --- | --- | --- | --- |
| `project` | `title` | `path` | `date` | `tags` |
| `experience` | `role` | `company` | `start` / `end` | `technologies` |
| `education` | `degree` | `institution` | `start` / `end` | `fieldOfStudy`, `grade` |
| `full` | `title` | `subtitle` | `date` / `period` | `tags` |
| `minimal` | `title` | — | — | `tags` |
| `listview` | generic | generic | generic | generic |

**`full`** — title, subtitle, description, image, tags, date, links.  
**`minimal`** — title, description/summary, tags only.  
**`listview`** — compact rows (title + date emphasis); supported where the theme implements it (e.g. premium/terminal/asthetic).

Centralize mapping in `layouts/layoutUtils.js`:

```js
export function getRecordFields(item, dataType, itemType = dataType) {
  const fields = { /* map all fields */ };
  if (dataType === 'minimal') {
    return {
      title: fields.title,
      summary: fields.summary,
      tags: fields.tags,
      subtitle: '',
      links: [],
      date: '',
      image: '',
    };
  }
  return fields;
}
```

Every layout must call `getRecordFields` — never read raw item fields ad hoc.

### `layout-type` reference

| `layout-type` | Typical use |
| --- | --- |
| `grid` | Card columns |
| `timeline` | Date rail + cards |
| `compact` | Dense stacked rows |
| `list` | Table / leaderboard rows |

Each theme must support all four. Each renderer must handle every `data-type`, empty arrays, missing images, and **items appended after pagination**.

---

## Theme folder structure

```
templates/
  <theme-name>/
    components/
      Layout.jsx          ← page shell; imports ./globals.css
      Hero.jsx
      SectionTabs.jsx     ← about / skills / dynamic sections / contact
      About.jsx
      Skills.jsx
      Contact.jsx
      motionConfig.js     ← framer-motion; tall-window viewport = once + low amount
      globals.css
      ui/
      layouts/
        LayoutRenderer.jsx   ← MUST wire pagination hooks
        GridLayout.jsx
        TimelineLayout.jsx
        ListLayout.jsx
        CompactLayout.jsx
        layoutUtils.js
```

### Required entry components

| Component | Props |
| --- | --- |
| `Layout` | `{ children, personal, socials?, skills?, Sections }` |
| `Hero` | `{ name, designation, headlines, summary, email, resume, location, logo, avatar, stats }` |
| `SectionTabs` | `{ personal, socials, skills, Sections, data }` |

`Layout` must import its own `globals.css`. Do **not** import theme CSS from `app/layout.js`.

---

## Adding a new theme

### Step 1 — Copy a starter

Copy a theme with the pagination mode **and** section UX you want:

- **Server-only + tabs:** copy `arcade` or `stickynote`
- **Server-only + scroll stack:** copy `terminal`
- **Hybrid (client + server) + scroll stack:** copy `premium`, `sinematic`, or `kinetic`
- **Server-only + section tabs + scene backdrop:** copy `kineticstage`

Rename class prefixes, motion helpers, and custom events. Keep imports inside the new theme folder + `lib/` only.

### Step 2 — Isolate styles and classes

- Prefix every class: `aurora-header`, not `premium-header`
- Scope typography under a root class (e.g. `.aurora-shell`)
- Prefer theme CSS over Tailwind for typography when they conflict
- Keep shared media in `public/`; theme-only decorations can live under the theme folder

### Step 3 — Wire fixed + dynamic sections

In `SectionTabs.jsx`:

1. Build the section list from `Sections` (do not hardcode project/experience IDs)
2. Render `About`, `Skills`, `Contact` for fixed sections
3. For each dynamic section, pass **`sectionData` + `sectionId`** into `LayoutRenderer`

### Step 4 — Implement layout utilities + pagination

1. Implement `getRecordFields` / image / links helpers in `layoutUtils.js`
2. In `LayoutRenderer`, use `usePaginatedSection` **or** `useHybridPaginatedSection`
3. Pass loaded/`visibleItems` into all four layouts
4. Style a "Show more" (and "Show less" for hybrid) control with theme classes
5. Ensure stagger lists use `animate={inView ? 'visible' : 'hidden'}` so paginated rows appear

Use `lib/DescriptionDisclosure` for array descriptions. Theme the trigger with CSS variables:

```css
--disclosure-accent: ...;
--disclosure-on-accent: ...;
--disclosure-font: ...;
```

Override `.yourtheme-app .description-disclosure-trigger:hover` if the default fill hover clashes with the theme.

### Step 5 — Register in `app/page.js`

```js
: template === 'aurora'
  ? await Promise.all([
      import('@/templates/aurora/components/Hero'),
      import('@/templates/aurora/components/Layout'),
      import('@/templates/aurora/components/SectionTabs'),
    ])
```

Add `'aurora'` to the allowed template array.

### Step 6 — Verify

See [Validation checklist](#validation-checklist). Seed with enough records (`> 10`) so server pagination is testable; hybrid themes also need `> CLIENT_REVEAL_START` for the client button.

---

## Updating an existing theme

Work **only** inside `templates/<theme-name>/` unless you are registering a new theme name or changing shared `lib/` contracts.

### Visual redesign

1. Update `globals.css`
2. Update `Hero`, `About`, layouts
3. Extend `motionConfig.js`; always respect `useReducedMotion()`
4. Keep window/section reveal viewports `once: true` with a low `amount` for tall content

### Layout / pagination fixes

1. Confirm `LayoutRenderer` still uses the shared hook (do not regress to client-only slicing of the full DB array — SSR only has the first 10)
2. Test all four `layout-type` values with `full` / `minimal` and with/without images
3. After "Show more", confirm new items are **visible** (not stuck at opacity 0)
4. Timeline rail alignment:

```css
.my-timeline {
  --timeline-marker-width: 3rem;
  --timeline-rail-x: calc(var(--timeline-marker-width) / 2);
}
```

### Contact forms

Use `lib/emailjs.js`. Required `.env.local`:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

Template variables: `name`, `time`, `email`, `message`.

---

## Theme isolation rules

| Rule | Why |
| --- | --- |
| Import only from `templates/<self>/` and `lib/` | Prevents cross-theme CSS and component leakage |
| Own `globals.css`, loaded by own `Layout` | Inactive theme CSS stays unloaded |
| Theme-prefixed class names | Avoid collisions when switching themes |
| Theme-scoped custom events | Layout nav ↔ SectionTabs without shared global state |
| Distinct visual identity | Do not copy another theme's chrome/motion wholesale |

---

## MongoDB collections

| Collection | Model |
| --- | --- |
| `template` | `{ _id: "active", value: "premium" \| ... }` |
| `personal` | `{ _id: "default", ...profile fields }` |
| `socials` | `{ _id: "default", ...links }` |
| `skills` | One doc per skill, sorted by `order` |
| `sections` | One doc per dynamic section, sorted by `order` |
| `data` | `{ _id, sectionId, items: [...] }` — **full** item arrays |

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=portfolio
```

```bash
npm run db:seed   # loads portfolio-sample-data.json into MongoDB
```

---

## Shared `lib/` utilities

| Module | Purpose |
| --- | --- |
| `lib/portfolioRepository.js` | SSR portfolio load; slices each section to first 10 items |
| `lib/usePaginatedSection.js` | Client pagination hooks (`usePaginatedSection`, `useHybridPaginatedSection`) |
| `lib/sectionDataUtils.js` | Optional helpers to normalize `{ items, total, hasMore }` |
| `lib/DescriptionDisclosure.jsx` | Expandable multi-paragraph descriptions |
| `lib/emailjs.js` | Contact form submission |
| `lib/mongodb.js` | DB connection (repository + API routes only) |

### API routes

| Route | Purpose |
| --- | --- |
| `app/api/sections/[sectionId]/items/route.js` | Paginated section items (`page`, `limit`) |

Themes must not open Mongo connections. Call the API from client hooks only.

---

## Assets

```
public/
  ProfileImage.jpg
  Banner.png
  resume.pdf
  asthetic/
  sinematic/
```

Reference from JSON with root-relative paths: `/Banner.png`, `/resume.pdf`.

---

## Accessibility and responsive requirements

- Semantic landmarks (`header`, `main`, `footer`, `nav`)
- Meaningful `alt` text
- Keyboard access + visible `:focus-visible`
- Mobile layouts with long names, missing images, empty arrays
- `prefers-reduced-motion`
- Touch targets ~44px; press feedback on interactive controls
- Prefer animating `transform` / `opacity`

---

## Validation checklist

### Automated

```bash
npm run lint
```

### Manual — data fidelity

- [ ] Every visible name, date, and description comes from JSON / MongoDB
- [ ] Empty optional fields do not break layout
- [ ] Resume and social links use `personal.resume` and `socials.*`
- [ ] No hardcoded portfolio copy in theme files

### Manual — dynamic sections

- [ ] All `Sections` entries render without per-section theme code
- [ ] `data-source` override resolves correctly
- [ ] New section appears after seed + refresh
- [ ] `full` / `minimal` show the correct fields in every layout

### Manual — pagination

- [ ] Initial payload has at most **10** items per section (`hasMore` accurate when total > 10)
- [ ] Server-only themes: Show more loads next 10 and **displays** them
- [ ] Premium / sinematic / kinetic: client reveals in steps; fetches when loaded items run out; Show less works
- [ ] Kineticstage: server-only Show more (no client reveal / Show less)
- [ ] Seed data includes sections with **> 10** items to exercise page 2
- [ ] Stagger layouts do not leave new rows invisible

### Manual — layouts

- [ ] `grid`, `timeline`, `compact`, `list` all work
- [ ] Records with and without images render cleanly
- [ ] `DescriptionDisclosure` works; theme hover styles look intentional
- [ ] Timeline dots align with the rail on desktop and mobile
- [ ] Tall timeline/window wrappers open early (`once` + low `amount`) and do not keep toggling closed

### Manual — theme isolation

- [ ] No imports from other `templates/` folders
- [ ] Switching `template` in MongoDB loads the correct theme
- [ ] No duplicate React keys in mapped lists

### Manual — hero and motion

- [ ] GIF avatars replay on re-entry (if applicable)
- [ ] Reduced-motion disables decorative animation
- [ ] Navigation works on mobile

---

## Quick reference — `app/page.js` contract

```jsx
<ThemeLayout personal={personal} socials={socials} skills={skills} Sections={Sections}>
  <section id="home">
    <ThemeHero
      name={personal.name}
      designation={personal.designation}
      headlines={personal.headlines}
      summary={personal.summary}
      email={personal.email}
      resume={personal.resume}
      location={personal.location}
      logo={personal.Logo}
      avatar={personal.Avatar}
      stats={stats}
    />
  </section>
  <section>
    <ThemeSections
      personal={personal}
      socials={socials}
      skills={skills}
      Sections={Sections}
      data={portfolioData}
    />
  </section>
</ThemeLayout>
```

`portfolioData[sectionId]` is `{ items, total, hasMore }`.

The theme owns everything visual. The page owns SSR loading and theme selection. Pagination beyond the first 10 items is owned by `LayoutRenderer` + `lib/usePaginatedSection.js` + the section items API.
