/* eslint-disable react/no-multi-comp -- Consumer fixtures are kept beside their compatibility tests. */
import { createElement, type ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from 'react-day-picker'
import { DatePicker, type DatePickerProps } from './index'

type Components = NonNullable<DatePickerProps['components']>
type LegacyDropdownProps = ComponentProps<NonNullable<Components['Dropdown']>>
const today = new Date(2026, 8, 13)

function LegacyDropdown({
	components,
	classNames,
	options,
	...props
}: LegacyDropdownProps) {
	return createElement(
		components.Select,
		{
			...props,
			className: classNames.dropdown,
		},
		options?.map(({ value, label, disabled }) =>
			createElement(components.Option, { key: value, value, disabled }, label),
		),
	)
}

function LegacyButton(
	props: ComponentProps<NonNullable<Components['Button']>>,
) {
	return createElement('button', { ...props, 'data-testid': 'legacy-button' })
}

describe('DatePicker v9 compatibility', () => {
	it('accepts the upstream dropdown without forwarding compatibility fields to HTML', () => {
		render(<DatePicker today={today} components={{ Dropdown }} />)
		const dropdown = screen.getByRole('combobox')
		expect(dropdown).not.toHaveAttribute('components')
		expect(dropdown).not.toHaveAttribute('classNames')
	})
	it.each(['Dropdown', 'YearsDropdown'] as const)(
		'preserves the legacy %s contract and focus across parent rerenders',
		async (slot) => {
			const user = userEvent.setup()
			const onMonthChange = vi.fn()
			const { rerender } = render(
				<DatePicker
					today={today}
					components={{ [slot]: LegacyDropdown }}
					onMonthChange={onMonthChange}
				/>,
			)
			const dropdown = screen.getByRole('combobox')
			dropdown.focus()
			rerender(
				<DatePicker
					today={today}
					components={{ [slot]: LegacyDropdown }}
					onMonthChange={onMonthChange}
				/>,
			)
			expect(screen.getByRole('combobox')).toBe(dropdown)
			expect(dropdown).toHaveFocus()
			await user.selectOptions(dropdown, '2024')
			expect(screen.getByRole('grid')).toHaveAttribute(
				'aria-label',
				'September 2024',
			)
			expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2024, 8, 1))
		},
	)

	it('retains components.Button for month navigation', async () => {
		const user = userEvent.setup()
		render(<DatePicker today={today} components={{ Button: LegacyButton }} />)
		expect(screen.getAllByTestId('legacy-button')).toHaveLength(2)
		await user.click(screen.getByRole('button', { name: /next month/i }))
		expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'October 2026')
	})

	it('retains formatter aliases without mutating the supplied object', () => {
		const formatters = Object.freeze({
			formatMonthCaption: () => 'Legacy caption',
			formatYearCaption: (date: Date) => `Year ${date.getFullYear()}`,
		})
		const { rerender } = render(
			<DatePicker today={today} formatters={formatters} />,
		)
		expect(screen.getByText('Legacy caption')).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Year 2026' })).toBeInTheDocument()
		rerender(
			<DatePicker
				today={today}
				formatters={{
					...formatters,
					formatCaption: () => 'Current caption',
					formatYearDropdown: () => 'Current year',
				}}
			/>,
		)
		expect(screen.getByText('Current caption')).toBeInTheDocument()
		expect(screen.queryByText('Legacy caption')).not.toBeInTheDocument()
		expect(
			screen.queryByRole('option', { name: 'Year 2026' }),
		).not.toBeInTheDocument()
	})

	it('keeps previously ignored legacy props inert', async () => {
		const user = userEvent.setup()
		const onDayKeyUp = vi.fn()
		render(
			<DatePicker
				today={today}
				fromYear={2020}
				toYear={2030}
				fromDate={new Date(2026, 8, 20)}
				initialFocus
				onDayKeyUp={onDayKeyUp}
				classNames={{ day_selected: 'legacy-selected' }}
				labels={{ labelDay: () => 'Legacy label' }}
			/>,
		)
		expect(screen.getByRole('option', { name: '1926' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: '2126' })).toBeInTheDocument()
		const day = screen.getByRole('button', { name: /September 13th, 2026/ })
		expect(day).not.toHaveFocus()
		day.focus()
		await user.keyboard('{ArrowRight}')
		expect(onDayKeyUp).not.toHaveBeenCalled()
	})
})
