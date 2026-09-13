# Suica UI

[![npm version](https://img.shields.io/npm/v/suica-ui.svg)](https://www.npmjs.com/package/suica-ui)
[![Storybook](https://img.shields.io/badge/Storybook-live-ff4785?logo=storybook&logoColor=white)](https://suica-ui.vercel.app/)

Suica's framework-neutral React component library. The package ships React components and precompiled Tailwind CSS, so consumers do not need to scan package source files.

[Explore the components in Storybook.](https://suica-ui.vercel.app/)

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
# or: npm install suica-ui
```

Import the package CSS once near the root of the application:

```tsx
import 'suica-ui/styles.css'
```

To override component utilities with Tailwind CSS v4 classes through `className`,
use the Tailwind-aware entry instead:

```css
@import 'suica-ui/tailwind.css';
```

Use one CSS entry, not both. The Tailwind-aware entry compiles the shared theme and utilities together with
consumer classes. The precompiled entry requires no Tailwind build step. Both
entries use `styles/shared.css` as their source of theme and utility definitions.

## Server and Client Components

The root entry remains source-compatible, but it no longer forces every export
through one Client Component boundary. Interactive implementations declare
their own boundary, while static primitives remain server-safe. Prefer component
subpaths in a Next.js Server Component so the server/client split and imported
module graph stay explicit:

```tsx
import { Badge } from 'suica-ui/badge'
import { Button } from 'suica-ui/button'
import { Card, CardContent } from 'suica-ui/card'
```

For example, migrate a static root import:

```tsx
// Before
import { Card, CardContent } from 'suica-ui'

// After
import { Card, CardContent } from 'suica-ui/card'
```

Stateful consumer wrappers still need their own Client Component directive:

```tsx
'use client'

import { Dialog } from 'suica-ui/dialog'
import { DropdownMenu } from 'suica-ui/dropdown-menu'
import { Sidebar } from 'suica-ui/sidebar'
import { Tabs } from 'suica-ui/tabs'
```

Server-safe subpaths are available for `alert`, `badge`, `button`, `card`,
`checkbox`, `field`, `input`, `label`, `loading-indicator`, `overlay`,
`scalable-tag`, `section-heading`, `select`, `separator`, `skeleton`, `spinner`, `table`, and `textarea`.
Client subpaths are available for `date-picker`, `dialog`, `dropdown-menu`,
`nested-scroll-view`, `sidebar`, `table-control`, and `tabs`. Client boundaries
are placed on the individual implementations rather than their package barrels,
so static exports are not promoted to the client unnecessarily.

## Components

- Forms: `DatePicker`, `Input`, `Textarea`, `Select`, `Label`, `Checkbox`, `Field`,
  `InputGroup`, and `InputGroupAddon`
- Actions and status: `Button`, `Switch`, `Badge`, `Alert`, `LoadingIndicator`,
  `Spinner`, and `Overlay`
- Structure and data: `Card`, `Table` primitives, `SectionHeading`, `Separator`, `Skeleton`,
  and `NestedScrollView`
- Navigation: `DropdownMenu`, `Tabs`, `Sidebar`, `SidebarTrigger`,
  `SidebarItems`, and `SidebarItem`
- Overlays: `Dialog`
- Tags: `ScalableTag` and `TagCloud`
- Specialized controls: `DiscreteSlider`, `Icon`, `IconCheckbox`,
  `HeartCheckbox`, and `StarCheckbox`

Interactive components use native platform controls where practical, forward
refs, and preserve native props unless their public API replaces them. See
[Storybook](https://suica-ui.vercel.app/) for component APIs, keyboard behavior,
accessibility notes, states, and composition examples.

## Scalable tags

`ScalableTag` preserves the Blog-React tag cloud's five count-based sizes:
below 2, 2+, 3+, 5+, and 8+. It displays the count as a superscript and uses
smaller text on mobile. `TagCloud` provides the wrapping list layout.

```tsx
import { ScalableTag, TagCloud } from 'suica-ui/scalable-tag'

;<TagCloud aria-label="Topics">
	<li>
		<ScalableTag href="/tags/react" count={8}>
			React
		</ScalableTag>
	</li>
	<li>
		<ScalableTag
			href="/tags/design"
			count={3}
			prefix="@"
			prefixClassName="text-blue-500"
		>
			Design
		</ScalableTag>
	</li>
</TagCloud>
```

The decorative `prefix` defaults to `#` in the theme accent color (green by
default). Pass any React node for an icon or custom content, or `null` to hide it.
Use `prefixClassName` to style it. The accessible link name includes its label
and count; supply `aria-label` to override it. For router links, use
`render={(props) => <Link {...props} href="/tags/react" />}` and forward all
supplied props, including `ref` and `children`. Routing stays in the application.

## Theme

Utilities use standard, unprefixed Tailwind class names. Semantic theme variables retain the `--sui-theme-*` namespace. Enable
dark mode with `class="dark"` or `data-theme="dark"` on an ancestor, and override
semantic `--sui-theme-*` properties within an application theme scope.

## Development

The Vite 8 and Vitest 5 development toolchain requires Node.js 22.12 or newer.
This requirement does not apply to consumers of the precompiled browser package.

Clone the repository, install its dependencies, and start Storybook:

```sh
git clone https://github.com/SuicaLondon/suica-ui.git
cd suica-ui
corepack enable
pnpm install
pnpm storybook
```

The local Storybook runs at `http://localhost:6006`. The latest deployed Storybook
is available at [suica-ui.vercel.app](https://suica-ui.vercel.app/).

Use the following commands for individual checks and builds:

```sh
pnpm typecheck
pnpm test
pnpm lint
pnpm build
pnpm test:package
pnpm test:react-compat
pnpm verify
pnpm storybook
pnpm build-storybook
```

`pnpm verify` runs formatting, linting, type checking, unit tests, package builds,
consumer checks, and tarball validation. `pnpm test:react-compat` smoke-tests the
packed package with React 18 and React 19 before release.

## License

[MIT](LICENSE)

## Router link composition

`DropdownMenuLink` and `SidebarItem` accept a `render` callback. Without it,
components continue to render native anchors. The callback must return one link
that renders an anchor and forwards all supplied props, including `ref`,
`children`, `className`, accessibility attributes, and event handlers.

For example, inside a Client Component using your application's next-intl Link:

```tsx
import { Link } from '@/i18n/navigation'
import { DropdownMenuLink } from 'suica-ui/dropdown-menu'
import { SidebarItem } from 'suica-ui/sidebar'

// Place inside DropdownMenuContent.
<DropdownMenuLink render={(props) => <Link {...props} href="/posts" />}>
  Posts
</DropdownMenuLink>

// Place inside SidebarItems. Pass aria-current for the active route.
<SidebarItem
  aria-current="page"
  badge="3"
  render={(props) => <Link {...props} href="/posts" />}
>
  Posts
</SidebarItem>
```

Set router-specific props such as typed `href` or `locale` on the rendered Link
following the spread. Put event handlers and style overrides on the Suica UI
component so its composed handlers and classes reach the link. Custom routers
must call the supplied `onClick` before intercepting navigation, and respect
`event.defaultPrevented`. Cancelling `onClick` or `onSelect` prevents menu link
selection from closing the menu; `closeOnSelect={false}` keeps it open without
cancelling navigation. Disabled menu links prevent default navigation.

`SidebarItem` retains its outer list item and supplies the composed icon, label,
and badge through `props.children`. Router behavior remains owned by the app;
Suica UI does not depend on Next.js or next-intl.

Dropdown menu content portals to `document.body`. Theme variables defined only
on a page wrapper do not reach it: provide the same variables on the portalled
content or an ancestor, including any public variables referenced by mappings.

## DatePicker

`DatePicker` adapts Toys Box's inline single-date calendar to Suica UI styling: previous/next month buttons, a year dropdown (100 years before and after today by default), Suica Button day controls, and localized month/week labels. It uses React DayPicker for keyboard navigation and date rules, with Suica theme styles included in either supported CSS entry.

```tsx
'use client'

import { useState } from 'react'
import { DatePicker } from 'suica-ui/date-picker'

export function BirthdayPicker() {
	const [date, setDate] = useState<Date | undefined>()
	return <DatePicker aria-label="Birthday" selected={date} onSelect={setDate} />
}
```

Use `required` to prevent clearing a selected date, `disabled` for unavailable dates, and `startMonth`/`endMonth` to bound navigation. `defaultMonth` defaults to the initial selection or today. Use `month` and `onMonthChange` when an external form reset must also change the visible month. Without `today`, the calendar appears after hydration so the browser can determine its local date without a server/client mismatch. To render the calendar on the server, pass the same serialized `today`, initial month, and explicit `timeZone` on both server and client; use the same locale as well. The default navigation bounds follow `timeZone` when provided.

Pass `locale` from `react-day-picker/locale` for localized labels; `labels` and `formatters` can customize them. `classNames` replaces styles for individual calendar parts. Keep React Hook Form's Controller and validation in the consumer; connect `field.value`/`field.onChange` to `selected`/`onSelect`, and associate any error message with `aria-describedby`. This is an inline calendar, not a text input or popup, and it does not submit a native form value automatically.

React 18 development SSR emits React DayPicker's upstream `useLayoutEffect` warning; rendering and the React 18/19 compatibility fixtures still pass.

## Separator

```tsx
import { Separator } from 'suica-ui/separator'

<Separator />
<Separator decorative={false} />
<div className="flex h-6 gap-4">
  <span>Profile</span>
  <Separator orientation="vertical" />
  <span>Settings</span>
</div>
```

Separators are decorative by default. Use `decorative={false}` for a semantic separator exposed to assistive technology. Vertical separators need a parent with a defined height. The component is server-safe and supports native div props and refs.

### Flat surfaces

Standard controls and cards use borders and theme colors without decorative shadows. Sidebar, Dialog, and DropdownMenu retain only a small shadow to distinguish floating layers. Keyboard focus rings and slider interaction indicators remain visible.

### Class name conventions

Use plain strings for short static class names and forward `className` directly when no defaults need merging. Use `cn` to merge defaults with caller classes, or split long class lists into multiple string arguments of at most 80 characters each (individual utility tokens stay intact). ESLint rejects string concatenation in class names and arbitrary selector variants such as `[&>svg]:size-4`. Put classes directly on the target element, or use a named Tailwind `@utility` for third-party markup and pseudo-elements.

```tsx
<div className="flex items-center gap-2" />
<div className={cn('flex items-center gap-2', className)} />
```

For conditional JSX children with a `null` fallback, use `&&` instead of a ternary expression. Coerce conditions that are not known booleans with `!!` to avoid rendering numeric zero. ESLint enforces this for JSX children; nullable data expressions and props retain their original semantics.

```tsx
<div>{items.length > 0 && <List items={items} />}</div>
<div>{!!title && <Heading>{title}</Heading>}</div>
```

Use named line-height utilities such as `leading-tight` instead of `leading-[1.25]`. ESLint rejects arbitrary `leading-[...]` and `leading-(...)` values. Define additional values through `--leading-*` theme tokens; this package provides `leading-compact` (1.05) and `leading-comfortable` (1.6).

VS Code and Cursor workspace settings enable Prettier formatting on save and ESLint fixes on explicit saves. Install the recommended Prettier and ESLint extensions. The existing `prettier-plugin-tailwindcss` configuration sorts classes in JSX and `cn(...)` using `src/styles.css` as the theme entry.

Keep `calc()`, `min()`, `max()`, and `clamp()` out of arbitrary class values. Define reusable sizing rules with Tailwind `@utility` in the stylesheet, such as `menu-viewport`, `dialog-viewport`, and `sidebar-width`. ESLint enforces this for class strings; JavaScript calculations and dynamic style values remain supported.

Do not reference CSS variables directly in class strings, including `text-[var(--icon)]` and `text-(--icon)`. Map variables through Tailwind theme tokens or named `@utility` definitions in the stylesheet. ESLint enforces this for class strings; dynamic inline styles remain supported.

Prefer numeric Tailwind utilities over equivalent arbitrary values: use `pt-18` for `pt-[4.5rem]` and `gap-y-5.5` for `gap-y-[22px]`. ESLint auto-fixes supported spacing, sizing, outline offset, opacity, and duration values. Spacing conversions use Tailwind's default `0.25rem` unit (4px at a 16px root font size).

Table primitives own their styles directly: `TableHeader` provides the header separator, `TableRow` provides row separators except on the last row of a section, and `TableFooter` provides its top separator. Cells use consistent padding without inspecting their children. Apply checkbox-specific spacing or alignment explicitly to the cell or checkbox through `className` when needed.

Use named blur theme tokens instead of arbitrary `blur-[…]` or `backdrop-blur-[…]` values. For example, `--blur-overlay: 1px` provides `backdrop-blur-overlay`. ESLint enforces this with `suica/no-arbitrary-blur`, including CSS-variable shorthand.

All project JavaScript and TypeScript files, including stories and tests, enforce `suica/no-arbitrary-values` and `suica/no-static-inline-styles`. Use standard utilities or named theme tokens instead of arbitrary values and properties. Attribute state variants such as `data-[state=open]:block` remain supported. The rule checks class attributes, class props, `cn` calls, and class/variant declarations. `pnpm test:eslint` also checks stylesheet `@apply` values.

Inline style properties must depend on runtime values (for example, `top: offset` or `height: height + "px"`) or reference CSS variables. Fixed values such as `padding: 16` belong in classes. Each property is checked independently; adding one dynamic property does not permit fixed siblings. Local style objects, aliases, spreads, and Storybook `args.style` are checked too. Consumer-provided styles and runtime function results remain supported.
