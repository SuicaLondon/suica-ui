import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { zhTW } from 'react-day-picker/locale'
import { DatePicker } from './index'

const today = new Date(2026, 8, 13)

describe('DatePicker', () => {
	it('hydrates safely when the local date changes across the server and client', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2026, 8, 30, 23, 59))
		const container = document.createElement('div')
		container.innerHTML = renderToString(<DatePicker />)
		document.body.append(container)
		vi.setSystemTime(new Date(2026, 9, 1, 0, 1))
		const onRecoverableError = vi.fn()
		const consoleError = vi.spyOn(console, 'error')
		let root: ReturnType<typeof hydrateRoot> | undefined
		try {
			await act(async () => {
				root = hydrateRoot(container, <DatePicker />, { onRecoverableError })
			})
			expect(screen.getByRole('grid')).toHaveAttribute(
				'aria-label',
				'October 2026',
			)
			expect(onRecoverableError).not.toHaveBeenCalled()
			expect(consoleError).not.toHaveBeenCalled()
		} finally {
			await act(async () => root?.unmount())
			container.remove()
			consoleError.mockRestore()
			vi.useRealTimers()
		}
	})

	it('selects a date and preserves required selection', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		const { rerender } = render(<DatePicker today={today} onSelect={onSelect} />)
		await user.click(screen.getByRole('button', { name: /September 15th, 2026/ }))
		expect(onSelect).toHaveBeenLastCalledWith(new Date(2026, 8, 15))
		rerender(
			<DatePicker
				today={today}
				selected={new Date(2026, 8, 15)}
				onSelect={onSelect}
				required
			/>,
		)
		await user.click(screen.getByRole('button', { name: /September 15th, 2026/ }))
		expect(onSelect).toHaveBeenLastCalledWith(new Date(2026, 8, 15))
	})

	it('navigates months and years without changing the selected date', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(
			<StrictMode>
				<DatePicker today={today} onSelect={onSelect} />
			</StrictMode>,
		)
		await user.click(screen.getByRole('button', { name: /next month/i }))
		expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'October 2026')
		await user.selectOptions(screen.getByRole('combobox'), '2024')
		expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'October 2024')
		await user.click(screen.getByRole('button', { name: /previous month/i }))
		expect(screen.getByRole('grid')).toHaveAttribute(
			'aria-label',
			'September 2024',
		)
		expect(onSelect).not.toHaveBeenCalled()
	})

	it('keeps disabled dates unavailable and supports keyboard selection', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(
			<DatePicker
				today={today}
				selected={today}
				disabled={{ before: today }}
				onSelect={onSelect}
			/>,
		)
		expect(
			screen.getByRole('button', { name: /September 12th, 2026/ }),
		).toBeDisabled()
		screen.getByRole('button', { name: /September 13th, 2026/ }).focus()
		await user.keyboard('{ArrowRight}{Enter}')
		expect(onSelect).toHaveBeenLastCalledWith(new Date(2026, 8, 14))
	})

	it('supports a controlled visible month and localized server rendering', () => {
		const { rerender } = render(<DatePicker today={today} month={today} />)
		rerender(<DatePicker today={today} month={new Date(2024, 1)} />)
		expect(screen.getByRole('grid')).toHaveAttribute(
			'aria-label',
			'February 2024',
		)
		const markup = renderToString(<DatePicker today={today} locale={zhTW} />)
		expect(markup).toContain('2026')
		expect(markup).toContain('九月')
	})
})
