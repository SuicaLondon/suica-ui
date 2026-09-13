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

Use one CSS entry, not both. The Tailwind-aware entry includes the precompiled
styles and generates consumer `sui:` utilities.

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
			prefixClassName="sui:text-blue-500"
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

Utilities and theme variables use the `sui:` and `--sui-*` namespaces. Enable
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
<div style={{ display: 'flex', height: 24, gap: 16 }}>
  <span>Profile</span>
  <Separator orientation="vertical" />
  <span>Settings</span>
</div>
```

Separators are decorative by default. Use `decorative={false}` for a semantic separator exposed to assistive technology. Vertical separators need a parent with a defined height. The component is server-safe and supports native div props and refs.

### Flat surfaces

Standard controls and cards use borders and theme colors without decorative shadows. Sidebar, Dialog, and DropdownMenu retain only a small shadow to distinguish floating layers. Keyboard focus rings and slider interaction indicators remain visible.
