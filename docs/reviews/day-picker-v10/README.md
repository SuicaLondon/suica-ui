# DayPicker v10 compatibility review

## Result

The review upgrades `react-day-picker` from 9.14.0 to 10.0.1 while retaining all 76 top-level `DatePickerProps` names and their optional status. No required props were added. The component layout, Tailwind classes, selection callback, and default navigation bounds are unchanged.

Baseline: `70e4c01` (master after dependency PRs #21 and #22). Implementation: `3084172`.

This is a review build, not an unconditional claim that every upstream extension point remains identical. PR #20 must not be merged as a bare dependency bump.

## Screenshots

The same Storybook examples, reference date (September 13, 2026), browser, viewport, and explicit theme were used for both builds. Screenshots were captured after rendering settled; they are actual browser captures, not generated mockups.

| Scenario                             | Before: v9.14.0                                                              | After: v10.0.1 with compatibility                                          |
| ------------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Default                              | ![Before: Default](before-default.jpg)                                       | ![After: Default](after-default.jpg)                                       |
| Selected date and footer             | ![Before: Selected date and footer](before-controlled.jpg)                   | ![After: Selected date and footer](after-controlled.jpg)                   |
| Traditional Chinese                  | ![Before: Traditional Chinese](before-localized.jpg)                         | ![After: Traditional Chinese](after-localized.jpg)                         |
| Disabled dates and navigation bounds | ![Before: Disabled dates and navigation bounds](before-restricted-dates.jpg) | ![After: Disabled dates and navigation bounds](after-restricted-dates.jpg) |
| Dark theme                           | ![Before: Dark theme](before-dark.jpg)                                       | ![After: Dark theme](after-dark.jpg)                                       |

All five settled before/after JPEG pairs are byte-identical. This establishes visual equality for these captured states only.

## Public props comparison

| Area                                                                         | Before                                                                                           | After                                                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Top-level property names                                                     | 76                                                                                               | Same 76; none added or removed                                                                   |
| Required properties                                                          | None                                                                                             | None                                                                                             |
| Selection                                                                    | `selected?: Date`, `onSelect?: (date: Date \| undefined) => void`, `required?: boolean`          | Unchanged                                                                                        |
| Navigation                                                                   | `month`, `defaultMonth`, `onMonthChange`, `startMonth`, `endMonth`, `onNextClick`, `onPrevClick` | Unchanged                                                                                        |
| Dates and locale                                                             | `today`, `timeZone`, `locale`, `disabled`, `hidden`, modifiers                                   | Unchanged property names and normal usage                                                        |
| Custom dropdowns                                                             | Receive `components`, `classNames`, and select props                                             | Legacy adapters still supply those values; component identity and focus survive parent rerenders |
| `components.Button`                                                          | Used by default previous/next buttons                                                            | Mapped to previous/next slots; specific overrides retain precedence                              |
| Formatter aliases                                                            | `formatMonthCaption`, `formatYearCaption`                                                        | Retained; current names take precedence                                                          |
| `classNames`, `styles`, `labels`, `components`, `formatters`, `dateLib` keys | v9 key sets                                                                                      | No keys removed; see behavior limitations below                                                  |
| Wrapper-controlled upstream props                                            | `mode`, `numberOfMonths`, `captionLayout`, `navLayout` excluded                                  | Still excluded                                                                                   |

### Deprecated inputs that were already inert

These inputs remain accepted to avoid unnecessarily breaking consumer code. They are not newly implemented:

- `fromDate`, `toDate`, `initialFocus`, the deprecated keyboard/pointer/touch event props, and `onWeekNumberClick` were already ignored by v9.
- `fromMonth`, `toMonth`, `fromYear`, and `toYear` were already superseded by this wrapper’s explicit `startMonth`/`endMonth` defaults. The default year range remains current year minus/plus 100.
- Deprecated v8 style/class keys (such as `day_selected`) and `labels.labelDay` were already unused by v9’s default rendering.
- `dateLib.Date` remains accepted in the override input; use `newDate`/`today` for functional date construction overrides.

Changing these formerly inert inputs into active features would itself change behavior, so this migration does not do that.

### Limits that still need a deliberate decision

1. **Inline styles can render differently.** v10.0.1 starts applying some previously ignored slot styles, including navigation buttons, chevrons, and year-specific dropdown styles. The screenshot stories do not supply these overrides. Their appearance can therefore change for consumers using them, despite the unchanged prop names.
2. **Direct upstream imports are not covered by the wrapper.** v10 removes deprecated exports and calendar subpaths. A consumer importing removed types/helpers directly from `react-day-picker` still needs to migrate those imports. The existing package name and the `zhTW` locale import used here remain valid.
3. **Nested upstream objects are not frozen.** For example, the `DateLib` instance exposed by upstream hooks/formatter arguments no longer has its deprecated `.Date` member. Keeping the wrapper’s input key does not restore every upstream object or hook shape.
4. **Visual scope is finite.** The captures cover the five named desktop states. Arbitrary custom components, every locale, browser, mobile viewport, open native select menus, and all date/time-zone combinations are not proven pixel-identical.

Under a strict requirement of zero change for every historical extension point, keep the upgrade unmerged until those cases are scoped and addressed. For the standard DatePicker usage shown here, the existing call sites require no prop edits.

## Verification

- `pnpm verify:release` passed: formatting, lint, custom ESLint-rule tests, TypeScript checking, 149 tests across 34 files, package-consumer checks, package build/tarball checks, React 18/19 compatibility checks, and Storybook build.
- Added regression tests cover legacy dropdown contracts, focus preservation on rerender, navigation callbacks, `components.Button`, formatter alias precedence, and already-ignored legacy behavior.
- The legacy dropdown/button/ignored-prop behavior was also exercised against v9: 4 baseline tests passed.
- A package-consumer TypeScript fixture compiles the public `DatePickerProps`, including deprecated keys and a custom dropdown.
- Compiler-based key comparison found no removals/additions in the 76 top-level keys or the six nested configuration key sets. Key equality alone is not full semantic type equivalence.
- React 18 server rendering still emits the pre-existing upstream `useLayoutEffect` warning; the compatibility checks pass.

## Full top-level property inventory

Every property below remains optional and available.

| Property                       | Before   | After    |
| ------------------------------ | -------- | -------- |
| `ISOWeek`                      | Optional | Optional |
| `animate`                      | Optional | Optional |
| `aria-label`                   | Optional | Optional |
| `aria-labelledby`              | Optional | Optional |
| `autoFocus`                    | Optional | Optional |
| `broadcastCalendar`            | Optional | Optional |
| `className`                    | Optional | Optional |
| `classNames`                   | Optional | Optional |
| `components`                   | Optional | Optional |
| `dateLib`                      | Optional | Optional |
| `defaultMonth`                 | Optional | Optional |
| `dir`                          | Optional | Optional |
| `disableNavigation`            | Optional | Optional |
| `disabled`                     | Optional | Optional |
| `endMonth`                     | Optional | Optional |
| `firstWeekContainsDate`        | Optional | Optional |
| `fixedWeeks`                   | Optional | Optional |
| `footer`                       | Optional | Optional |
| `formatters`                   | Optional | Optional |
| `fromDate`                     | Optional | Optional |
| `fromMonth`                    | Optional | Optional |
| `fromYear`                     | Optional | Optional |
| `hidden`                       | Optional | Optional |
| `hideNavigation`               | Optional | Optional |
| `hideWeekdays`                 | Optional | Optional |
| `id`                           | Optional | Optional |
| `initialFocus`                 | Optional | Optional |
| `labels`                       | Optional | Optional |
| `lang`                         | Optional | Optional |
| `locale`                       | Optional | Optional |
| `modifiers`                    | Optional | Optional |
| `modifiersClassNames`          | Optional | Optional |
| `modifiersStyles`              | Optional | Optional |
| `month`                        | Optional | Optional |
| `nonce`                        | Optional | Optional |
| `noonSafe`                     | Optional | Optional |
| `numerals`                     | Optional | Optional |
| `onDayBlur`                    | Optional | Optional |
| `onDayClick`                   | Optional | Optional |
| `onDayFocus`                   | Optional | Optional |
| `onDayKeyDown`                 | Optional | Optional |
| `onDayKeyPress`                | Optional | Optional |
| `onDayKeyUp`                   | Optional | Optional |
| `onDayMouseEnter`              | Optional | Optional |
| `onDayMouseLeave`              | Optional | Optional |
| `onDayPointerEnter`            | Optional | Optional |
| `onDayPointerLeave`            | Optional | Optional |
| `onDayTouchCancel`             | Optional | Optional |
| `onDayTouchEnd`                | Optional | Optional |
| `onDayTouchMove`               | Optional | Optional |
| `onDayTouchStart`              | Optional | Optional |
| `onMonthChange`                | Optional | Optional |
| `onNextClick`                  | Optional | Optional |
| `onPrevClick`                  | Optional | Optional |
| `onSelect`                     | Optional | Optional |
| `onWeekNumberClick`            | Optional | Optional |
| `pagedNavigation`              | Optional | Optional |
| `required`                     | Optional | Optional |
| `reverseMonths`                | Optional | Optional |
| `reverseYears`                 | Optional | Optional |
| `role`                         | Optional | Optional |
| `selected`                     | Optional | Optional |
| `showOutsideDays`              | Optional | Optional |
| `showWeekNumber`               | Optional | Optional |
| `startMonth`                   | Optional | Optional |
| `style`                        | Optional | Optional |
| `styles`                       | Optional | Optional |
| `timeZone`                     | Optional | Optional |
| `title`                        | Optional | Optional |
| `toDate`                       | Optional | Optional |
| `toMonth`                      | Optional | Optional |
| `toYear`                       | Optional | Optional |
| `today`                        | Optional | Optional |
| `useAdditionalDayOfYearTokens` | Optional | Optional |
| `useAdditionalWeekYearTokens`  | Optional | Optional |
| `weekStartsOn`                 | Optional | Optional |
