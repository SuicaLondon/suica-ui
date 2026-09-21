/* eslint-disable react/no-multi-comp -- These components exercise the published consumer contract. */
import { createElement, type ComponentProps } from 'react'
import { DatePicker, type DatePickerProps } from 'suica-ui/date-picker'

type LegacyDropdownProps = ComponentProps<
	NonNullable<NonNullable<DatePickerProps['components']>['Dropdown']>
>

// Keep existing consumer code valid, including v9 compatibility properties.
const props = {
	selected: new Date(2026, 8, 13),
	onSelect: (date: Date | undefined) => void date,
	required: true,
	today: new Date(2026, 8, 13),
	month: new Date(2026, 8, 1),
	onMonthChange: (month: Date) => void month,
	startMonth: new Date(2020, 0),
	endMonth: new Date(2030, 11),
	fromDate: new Date(2020, 0),
	toDate: new Date(2030, 11),
	fromMonth: new Date(2020, 0),
	toMonth: new Date(2030, 11),
	fromYear: 2020,
	toYear: 2030,
	initialFocus: false,
	onWeekNumberClick: () => undefined,
	onDayKeyUp: (date, modifiers, event) => void [date, modifiers, event.key],
	onDayKeyPress: (date, modifiers, event) => void [date, modifiers, event.key],
	onDayPointerEnter: (date, modifiers, event) =>
		void [date, modifiers, event.pointerType],
	onDayPointerLeave: (date, modifiers, event) =>
		void [date, modifiers, event.pointerType],
	onDayTouchCancel: (date, modifiers, event) =>
		void [date, modifiers, event.touches],
	onDayTouchEnd: (date, modifiers, event) =>
		void [date, modifiers, event.touches],
	onDayTouchMove: (date, modifiers, event) =>
		void [date, modifiers, event.touches],
	onDayTouchStart: (date, modifiers, event) =>
		void [date, modifiers, event.touches],
	classNames: { day_selected: 'legacy-selected', selected: 'selected' },
	styles: { day_selected: { color: 'green' }, selected: { color: 'green' } },
	dateLib: { Date },
	labels: { labelDay: () => 'Legacy day label' },
	formatters: {
		formatMonthCaption: (date) => String(date.getMonth()),
		formatYearCaption: (date) => String(date.getFullYear()),
	},
	components: {
		Button: (buttonProps) => createElement('button', buttonProps),
		Dropdown: ({
			components,
			classNames,
			options,
			...dropdownProps
		}: LegacyDropdownProps) =>
			createElement(
				components.Select,
				{ ...dropdownProps, className: classNames.dropdown },
				options?.map(({ value, label, disabled }) =>
					createElement(components.Option, { key: value, value, disabled }, label),
				),
			),
	},
} satisfies DatePickerProps

createElement(DatePicker, props)
