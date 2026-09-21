import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from 'react-day-picker'
import { DatePicker } from './index'

const today = new Date(2026, 8, 13)

describe('DatePicker v10 customization', () => {
	it('applies navigation and year-dropdown styles from upstream', () => {
		render(
			<DatePicker
				today={today}
				styles={{
					button_previous: { backgroundColor: 'rgb(254, 226, 226)' },
					button_next: { backgroundColor: 'rgb(254, 226, 226)' },
					dropdown: { color: 'rgb(120, 53, 15)' },
					years_dropdown: { backgroundColor: 'rgb(254, 243, 199)' },
				}}
			/>,
		)
		expect(screen.getByRole('button', { name: /previous month/i })).toHaveStyle({
			backgroundColor: 'rgb(254, 226, 226)',
		})
		expect(screen.getByRole('button', { name: /next month/i })).toHaveStyle({
			backgroundColor: 'rgb(254, 226, 226)',
		})
		expect(screen.getByRole('combobox')).toHaveStyle({
			backgroundColor: 'rgb(254, 243, 199)',
			color: 'rgb(120, 53, 15)',
		})
	})

	it('uses current formatters and keeps the local year dropdown mounted', async () => {
		const user = userEvent.setup()
		const onMonthChange = vi.fn()
		const formatters = Object.freeze({
			formatYearDropdown: (date: Date) => `Year ${date.getFullYear()}`,
		})
		const { rerender } = render(
			<DatePicker
				today={today}
				formatters={formatters}
				onMonthChange={onMonthChange}
			/>,
		)
		const dropdown = screen.getByRole('combobox')
		expect(screen.getByRole('option', { name: 'Year 2026' })).toBeInTheDocument()
		dropdown.focus()
		rerender(
			<DatePicker
				today={today}
				formatters={formatters}
				onMonthChange={onMonthChange}
			/>,
		)
		expect(screen.getByRole('combobox')).toBe(dropdown)
		expect(dropdown).toHaveFocus()
		await user.selectOptions(dropdown, '2024')
		expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2024, 8, 1))
	})

	it('accepts the upstream dropdown without leaking removed props into HTML', () => {
		render(<DatePicker today={today} components={{ Dropdown }} />)
		const dropdown = screen.getByRole('combobox')
		expect(dropdown).not.toHaveAttribute('components')
		expect(dropdown).not.toHaveAttribute('classNames')
	})
})
