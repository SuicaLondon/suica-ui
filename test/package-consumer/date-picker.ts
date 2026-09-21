import { createElement } from 'react'
import {
	DateLib,
	Dropdown,
	formatCaption,
	type DateLibOptions,
} from 'react-day-picker'
import { DatePicker, type DatePickerProps } from 'suica-ui/date-picker'

const options: DateLibOptions = {}
const dateLib = new DateLib(options)
const date = dateLib.newDate(2026, 8, 13)

// Use the supported v10 APIs through the published package.
const props = {
	selected: date,
	onSelect: (selected: Date | undefined) => void selected,
	required: true,
	today: date,
	month: date,
	onMonthChange: (month: Date) => void month,
	startMonth: new Date(2020, 0),
	endMonth: new Date(2030, 11),
	hidden: { before: new Date(2020, 0), after: new Date(2030, 11, 31) },
	autoFocus: false,
	classNames: { selected: 'selected' },
	styles: { years_dropdown: { backgroundColor: 'gold' } },
	labels: { labelDayButton: () => 'Choose this day' },
	formatters: {
		formatCaption,
		formatYearDropdown: (year: Date) => String(year.getFullYear()),
	},
	components: { Dropdown },
} satisfies DatePickerProps

createElement(DatePicker, props)

// Removed upstream props should fail loudly rather than being silently ignored.
// @ts-expect-error Use startMonth instead.
const oldBounds: DatePickerProps = { fromYear: 2020 }
const oldButton: DatePickerProps = {
	// @ts-expect-error Use the individual navigation button slots.
	components: { Button: () => createElement('button') },
}
const oldFormatter: DatePickerProps = {
	// @ts-expect-error Use formatYearDropdown instead.
	formatters: { formatYearCaption: () => '2026' },
}
void [oldBounds, oldButton, oldFormatter]
