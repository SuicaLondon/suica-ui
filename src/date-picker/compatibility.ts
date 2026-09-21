import { createElement, useMemo, type CSSProperties, type JSX } from 'react'
import {
	useDayPicker,
	Dropdown as DefaultDropdown,
	MonthsDropdown as DefaultMonthsDropdown,
	YearsDropdown as DefaultYearsDropdown,
	PreviousMonthButton,
	type ClassNames,
	type CustomComponents,
	type DayEventHandler,
	type DropdownProps,
	type Formatters,
	type Labels,
	type PropsBase,
	type Styles,
} from 'react-day-picker'

// Keep the v9 dropdown contract for consumers that supply custom components.
type CompatibleDropdownProps = DropdownProps & {
	components: CompatibleComponents
	classNames: ClassNames
}
type CompatibleDropdown = (props: CompatibleDropdownProps) => JSX.Element
type CompatibleComponents = Omit<
	CustomComponents,
	'Dropdown' | 'MonthsDropdown' | 'YearsDropdown'
> & {
	Button: CustomComponents['PreviousMonthButton']
	Dropdown: CompatibleDropdown
	MonthsDropdown: CompatibleDropdown
	YearsDropdown: CompatibleDropdown
}

// These v8 names were accepted but already unused by DayPicker v9.
type LegacyStyleKey =
	| 'button'
	| 'button_reset'
	| 'caption'
	| 'caption_between'
	| 'caption_dropdowns'
	| 'caption_end'
	| 'caption_start'
	| 'cell'
	| 'day_disabled'
	| 'day_hidden'
	| 'day_outside'
	| 'day_range_end'
	| 'day_range_middle'
	| 'day_range_start'
	| 'day_selected'
	| 'day_today'
	| 'dropdown_icon'
	| 'dropdown_month'
	| 'dropdown_year'
	| 'head'
	| 'head_cell'
	| 'head_row'
	| 'multiple_months'
	| 'nav_button'
	| 'nav_button_next'
	| 'nav_button_previous'
	| 'nav_icon'
	| 'row'
	| 'table'
	| 'tbody'
	| 'tfoot'
	| 'vhidden'
	| 'weeknumber'
	| 'with_weeknumber'

export interface CompatibleDatePickerProps extends Omit<
	PropsBase,
	'components' | 'formatters' | 'labels' | 'classNames' | 'styles' | 'dateLib'
> {
	components?: Partial<CompatibleComponents>
	dateLib?: PropsBase['dateLib'] & { Date?: typeof Date }
	formatters?: Partial<Formatters> & {
		formatMonthCaption?: Formatters['formatCaption']
		formatYearCaption?: Formatters['formatYearDropdown']
	}
	labels?: Partial<Labels> & { labelDay?: Labels['labelDayButton'] }
	classNames?: Partial<ClassNames> & Partial<Record<LegacyStyleKey, string>>
	styles?: Partial<Styles> & Partial<Record<LegacyStyleKey, CSSProperties>>
	/** @deprecated Use startMonth/endMonth. Existing wrapper defaults take precedence. */
	fromMonth?: Date
	/** @deprecated Use startMonth/endMonth. Existing wrapper defaults take precedence. */
	toMonth?: Date
	/** @deprecated Use startMonth/endMonth. Existing wrapper defaults take precedence. */
	fromYear?: number
	/** @deprecated Use startMonth/endMonth. Existing wrapper defaults take precedence. */
	toYear?: number
	/** @deprecated Already ignored in v9. Use hidden instead. */
	fromDate?: Date
	/** @deprecated Already ignored in v9. Use hidden instead. */
	toDate?: Date
	/** @deprecated Already ignored in v9. Use autoFocus instead. */
	initialFocus?: boolean
	/** @deprecated Already ignored in v9. Use a custom WeekNumber component. */
	onWeekNumberClick?: any
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayKeyUp?: DayEventHandler<React.KeyboardEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayKeyPress?: DayEventHandler<React.KeyboardEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayPointerEnter?: DayEventHandler<React.PointerEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayPointerLeave?: DayEventHandler<React.PointerEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayTouchCancel?: DayEventHandler<React.TouchEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayTouchEnd?: DayEventHandler<React.TouchEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayTouchMove?: DayEventHandler<React.TouchEvent>
	/** @deprecated Already ignored in v9. Use a custom DayButton component. */
	onDayTouchStart?: DayEventHandler<React.TouchEvent>
}

function adaptDropdown(Dropdown: CompatibleDropdown | undefined) {
	if (!Dropdown) return undefined
	if (Dropdown === DefaultDropdown) return DefaultDropdown
	if (Dropdown === DefaultMonthsDropdown) return DefaultMonthsDropdown
	if (Dropdown === DefaultYearsDropdown) return DefaultYearsDropdown
	return function CompatibleDropdownComponent(props: DropdownProps) {
		const { components, classNames } = useDayPicker()
		const legacyComponents: Partial<CompatibleComponents> = components
		return createElement(Dropdown, {
			...props,
			classNames,
			components: {
				...components,
				Button: legacyComponents.Button ?? PreviousMonthButton,
			},
		})
	}
}

export function useCompatibleComponents(
	components: CompatibleDatePickerProps['components'],
) {
	// Key each adapter by the component itself so ordinary rerenders keep focus.
	const Dropdown = useMemo(
		() => adaptDropdown(components?.Dropdown),
		[components?.Dropdown],
	)
	const MonthsDropdown = useMemo(
		() => adaptDropdown(components?.MonthsDropdown),
		[components?.MonthsDropdown],
	)
	const YearsDropdown = useMemo(
		() => adaptDropdown(components?.YearsDropdown),
		[components?.YearsDropdown],
	)
	const result: Partial<CustomComponents> = {
		...components,
		Dropdown,
		MonthsDropdown,
		YearsDropdown,
	}
	if (!Dropdown) delete result.Dropdown
	if (!MonthsDropdown) delete result.MonthsDropdown
	if (!YearsDropdown) delete result.YearsDropdown
	if (components?.Button) {
		result.PreviousMonthButton =
			components.PreviousMonthButton ?? components.Button
		result.NextMonthButton = components.NextMonthButton ?? components.Button
	}
	return result
}

export function compatibleFormatters(
	formatters: CompatibleDatePickerProps['formatters'],
): PropsBase['formatters'] {
	if (!formatters) return undefined
	const { formatMonthCaption, formatYearCaption, ...current } = formatters
	if (!current.formatCaption && formatMonthCaption)
		current.formatCaption = formatMonthCaption
	if (!current.formatYearDropdown && formatYearCaption)
		current.formatYearDropdown = formatYearCaption
	return current
}
