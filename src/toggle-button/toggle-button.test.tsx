import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Switch } from './index'

describe('Switch', () => {
	it('uses native checkbox behavior and forwards input props and refs', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		const ref = createRef<HTMLInputElement>()

		render(
			<Switch
				ref={ref}
				label="Notifications"
				name="notifications"
				data-testid="notification-switch"
				onChange={onChange}
			/>,
		)

		const control = screen.getByRole('switch', { name: 'Notifications' })
		expect(control).not.toBeChecked()
		expect(control).toHaveAttribute('name', 'notifications')
		expect(ref.current).toBe(screen.getByTestId('notification-switch'))

		await user.click(control)

		expect(control).toBeChecked()
		expect(onChange).toHaveBeenCalledTimes(1)
	})

	it('supports controlled state and the native disabled contract', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		const { rerender } = render(
			<Switch label="Dark mode" checked={false} onChange={onChange} />,
		)

		const control = screen.getByRole('switch', { name: 'Dark mode' })
		await user.click(control)

		expect(onChange).toHaveBeenCalledTimes(1)
		expect(control).not.toBeChecked()

		rerender(<Switch label="Dark mode" checked disabled onChange={onChange} />)

		expect(control).toBeChecked()
		expect(control).toBeDisabled()
		await user.click(control)
		expect(onChange).toHaveBeenCalledTimes(1)
	})
})
