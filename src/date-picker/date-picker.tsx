'use client'

import { TZDate, DayPicker, type ClassNames } from 'react-day-picker'
import { useHydrated } from '../internal/use-hydrated.js'
import { YearDropdown } from './year-dropdown.js'
import {
	compatibleFormatters,
	useCompatibleComponents,
	type CompatibleDatePickerProps,
} from './compatibility.js'
import { cn } from '../cn.js'
import { buttonClassName } from '../button/index.js'

export interface DatePickerProps extends Omit<
	CompatibleDatePickerProps,
	'mode' | 'numberOfMonths' | 'captionLayout' | 'navLayout'
> {
	selected?: Date
	onSelect?: (date: Date | undefined) => void
	required?: boolean
}

const calendarClasses: Partial<ClassNames> = {
	months: 'w-full',
	month: 'relative w-full space-y-3',
	month_caption: 'mx-11 flex h-9 items-center justify-center',
	dropdowns: 'flex w-full items-center justify-between gap-2',
	caption_label: 'text-sm font-semibold',
	chevron: 'size-4 fill-current',
	button_previous: buttonClassName({
		variant: 'outline',
		size: 'icon',
		className: 'absolute start-0 top-0 size-9',
	}),
	button_next: buttonClassName({
		variant: 'outline',
		size: 'icon',
		className: 'absolute end-0 top-0 size-9',
	}),
	month_grid: 'w-full border-collapse',
	weekday: cn('h-9 p-0 text-center text-xs font-normal text-muted', 'font-mono'),
	day: 'p-0 text-center',
	day_button: buttonClassName({
		variant: 'ghost',
		size: 'icon',
		className: 'mx-auto my-0.5 size-9 text-sm',
	}),
	selected: 'calendar-selected',
	today: 'calendar-today',
	outside: 'opacity-45',
	disabled: 'opacity-30',
	hidden: 'invisible',
	footer: 'mt-3 text-sm text-muted',
}

function createCalendarMonth(
	year: number,
	month: number,
	timeZone: string | undefined,
) {
	if (timeZone) return new TZDate(year, month, 1, timeZone)
	return new Date(year, month, 1)
}

/** Inline single-date calendar with the month and year navigation used by Toys Box. */
export function DatePicker({
	selected,
	onSelect,
	required = false,
	className,
	classNames,
	components,
	formatters,
	today,
	timeZone,
	startMonth,
	endMonth,
	defaultMonth,
	showOutsideDays = false,
	...props
}: DatePickerProps) {
	const compatibleComponents = useCompatibleComponents(components)
	const hydrated = useHydrated()
	if (!hydrated && today === undefined) return null

	const currentDate = today ?? new Date()
	const calendarToday = timeZone
		? new TZDate(currentDate, timeZone)
		: currentDate
	const year = calendarToday.getFullYear()
	const firstMonth = startMonth ?? createCalendarMonth(year - 100, 0, timeZone)
	const lastMonth = endMonth ?? createCalendarMonth(year + 100, 11, timeZone)

	return (
		<DayPicker
			{...props}
			mode="single"
			required={required}
			selected={selected}
			onSelect={onSelect ? (date: Date | undefined) => onSelect(date) : undefined}
			today={calendarToday}
			timeZone={timeZone}
			startMonth={firstMonth}
			endMonth={lastMonth}
			defaultMonth={defaultMonth ?? selected ?? calendarToday}
			showOutsideDays={showOutsideDays}
			numberOfMonths={1}
			captionLayout="dropdown-years"
			navLayout="around"
			className={cn(
				'box-border w-full max-w-80 rounded-panel border',
				'border-line bg-surface-elevated p-4 text-foreground',
				'font-sans',
				className,
			)}
			components={{ Dropdown: YearDropdown, ...compatibleComponents }}
			formatters={compatibleFormatters(formatters)}
			classNames={{ ...calendarClasses, ...classNames }}
		/>
	)
}
