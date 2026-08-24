import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Label } from '../label'
import { Checkbox } from './index'

describe('Checkbox', () => {
	it('uses native checkbox and label behavior', async () => {
		const user = userEvent.setup()
		const ref = createRef<HTMLInputElement>()

		const { container } = render(
			<div>
				<Checkbox ref={ref} id="bots" name="bots" value="only" />
				<Label htmlFor="bots">Bots only</Label>
			</div>,
		)

		const checkbox = screen.getByRole('checkbox', { name: 'Bots only' })
		await user.click(screen.getByText('Bots only'))

		expect(ref.current).toBe(checkbox)
		expect(checkbox).toBeChecked()
		expect(checkbox).toHaveAttribute('type', 'checkbox')
		expect(checkbox).toHaveAttribute('name', 'bots')
		expect(checkbox).toHaveAttribute('value', 'only')
		expect(checkbox).toHaveAttribute('data-slot', 'checkbox')
		expect(checkbox).toHaveClass(
			'sui:peer',
			'sui:appearance-none',
			'sui:rounded-sm',
			'sui:checked:bg-accent',
			'sui:focus-visible:ring-1',
		)
		expect(
			container.querySelector('[data-slot="checkbox-indicator"]'),
		).toHaveAttribute('aria-hidden', 'true')
	})

	it('exposes native disabled and required states', () => {
		const { container } = render(
			<Checkbox aria-label="Accept" disabled required />,
		)
		const checkbox = screen.getByRole('checkbox', { name: 'Accept' })
		const indicator = container.querySelector('[data-slot="checkbox-indicator"]')
		expect(checkbox).toBeDisabled()
		expect(checkbox).toBeRequired()
		expect(indicator).toHaveClass(
			'sui:opacity-0',
			'sui:peer-disabled:text-surface-elevated/50',
		)
		expect(indicator).not.toHaveClass('sui:peer-disabled:opacity-50')
	})
})
