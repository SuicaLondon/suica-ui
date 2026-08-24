# Suica UI

Suica's framework-neutral React component library. The package ships React components and precompiled Tailwind CSS, so consumers do not need to scan package source files.

## Requirements

- React 18 or 19
- React DOM 18 or 19
- Tailwind CSS 4 only when using the Tailwind-aware CSS entry

Suica UI is ESM-only. React and React DOM are peer dependencies; its only runtime
utilities are `clsx` and `tailwind-merge`. It does
not depend on Next.js, Radix, CVA, or an icon package.

## Install

```sh
pnpm add suica-ui
```

Import the package CSS once near the root of the application:

```tsx
import 'suica-ui/styles.css'
```

The precompiled entry is enough when the application uses component variants,
sizes, inline styles, or its own CSS class names. To override component utilities
with Tailwind classes through `className`, import the Tailwind-aware entry instead:

```css
@import 'suica-ui/tailwind.css';
```

Use one CSS entry, not both. The Tailwind-aware entry includes the precompiled
component stylesheet and generates any `sui:` utilities found in the consuming
application, so `cn` / `twMerge` overrides such as `sui:size-13` remain present in
the final CSS.

Then import components from the package root:

```tsx
import { Button, Field, Input, Switch, Tabs } from 'suica-ui'

const tabs = [
	{ id: 'profile', label: 'Profile', panel: <p>Profile settings</p> },
	{ id: 'security', label: 'Security', panel: <p>Security settings</p> },
]

export function Preferences() {
	return (
		<>
			<Field label="Display name" description="Shown on your public profile.">
				<Input name="displayName" />
			</Field>
			<Switch label="Dark mode" />
			<Tabs aria-label="Settings" tabs={tabs} />
			<Button>Save changes</Button>
		</>
	)
}
```

## Components

- Forms: `Input`, `Textarea`, `Select`, `Label`, `Checkbox`, `Field`,
  `InputGroup`, and `InputGroupAddon`
- Actions and status: `Button`, `Switch`, `Badge`, `Alert`, `LoadingIndicator`,
  `Spinner`, and `Overlay`
- Structure and data: `Card`, `Table` primitives, `SectionHeading`, `Skeleton`,
  and `NestedScrollView`
- Navigation: `Tabs`, `Sidebar`, `SidebarTrigger`, `SidebarItems`, and
  `SidebarItem`
- Specialized controls: `DiscreteSlider`, `Icon`, `IconCheckbox`,
  `HeartCheckbox`, and `StarCheckbox`

Every interactive component builds on native DOM controls, forwards its ref, and accepts the corresponding native props unless its public API replaces them explicitly.

`Field` accepts one native-style control as its child. It generates stable ids and
wires the label, optional description, optional error, `aria-describedby`, and
`aria-invalid` without depending on a form library. Bespoke editor layouts can
compose `Label` with the primitive controls directly, so React Hook Form or another
validator stays in the consuming application.

`Overlay` is only the visual layer; `LoadingIndicator` owns the progress status,
animated indicator, and visible label. Compose them when an existing surface must
remain visible while it refreshes.

`Spinner` is a compact circular progressbar. Omit `percentage` for indeterminate
progress, or provide a value from 0 to 100 for a determinate ring; out-of-range
values are clamped. Its required `label` supplies the accessible name. The ring
keeps the Blog dashboard's compact loading-indicator proportions and inherits
the surrounding theme color.

`Skeleton` uses a moving shimmer with `white` as its default tone. The `accent`,
`success`, `warning`, and `danger` tones reuse the corresponding theme tokens.

`Table` follows the Blog dashboard's native table density and row interactions.
Wrap it in the explicitly named `TableContainer` when horizontal scrolling is
possible. `TableControl` provides the dashboard footer pagination UI: it owns
page boundaries, busy states, the optional page-size selector, and its live
summary while the consuming application keeps routing, data fetching, and
trailing business actions.

`Sidebar` defaults to a modal off-canvas navigation dialog. It moves focus inside,
traps keyboard focus while open, closes on Escape, locks document scrolling, and
restores the previously focused control when it closes. Use `mode="persistent"`
for a dashboard sidebar that occupies layout width without modal focus or scroll
side effects; pass `triggerInset={false}` to `SidebarItems` when no fixed trigger
occupies its top edge.

Suica UI's generated utility classes and theme variables use the `sui:` / `--sui-*` namespace so its stylesheet can coexist with a consumer Tailwind build. Component styling is colocated in React as standard Tailwind utilities composed with `cn`; `src/styles.css` contains only the Tailwind compiler entry and shared theme tokens, not component selectors.

## Theme

The default theme uses Suica's warm off-white surface, near-black foreground, and green accent. Dark mode is enabled by placing either `class="dark"` or `data-theme="dark"` on an ancestor; explicit `light` and `dark` values take precedence over the operating-system preference.

Applications can override the semantic `--sui-theme-*` custom properties on a theme scope. The public palette includes surface, elevated surface, foreground, muted, accent, line, focus, backdrop, and danger/warning/success status families.

## Development

The Vite 7 development toolchain requires Node.js 20.19 or newer. This requirement
does not apply to consumers of the precompiled browser package.

```sh
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm test:package
pnpm verify
pnpm storybook
pnpm build-storybook
```

The generated package files are written to `dist/`. `src/styles.css` is the source Tailwind 4 entry; `dist/styles.css` is the precompiled consumer stylesheet.
`pnpm storybook` uses the Vite builder and compiles `src/styles.css` directly, so component and CSS changes update through the same development pipeline.

`pnpm verify` runs formatting, linting, type checking, unit tests, a production build, and a strict package-consumer type check. The consumer check enables TypeScript's `noUncheckedSideEffectImports` so the public declarations cannot accidentally depend on the internal CSS build entry.

Pull requests and pushes to `master` run the same verification plus a complete
Storybook build in GitHub Actions. Dependabot tracks both npm and GitHub Actions
updates.
