import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Alert } from './index'

describe('Alert', () => {
	it('renders composed content with danger semantics and forwards native props', () => {
		const ref = createRef<HTMLDivElement>()

		render(
			<Alert
				ref={ref}
				variant="danger"
				icon={<span aria-hidden="true">!</span>}
				title="Unable to save"
				action={<button type="button">Retry</button>}
				className="custom-alert"
				data-testid="save-alert"
			>
				Check your connection and try again.
			</Alert>,
		)

		const alert = screen.getByRole('alert')
		expect(alert).toBe(screen.getByTestId('save-alert'))
		expect(ref.current).toBe(alert)
		expect(alert).toHaveAttribute('data-variant', 'danger')
		expect(alert).toHaveClass('custom-alert')
		expect(screen.getByText('Unable to save')).toBeInTheDocument()
		expect(
			screen.getByText('Check your connection and try again.'),
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
	})

	it('uses polite status semantics for informational variants and permits role overrides', () => {
		const { rerender } = render(<Alert>Refreshing the dashboard.</Alert>)

		expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'info')

		rerender(
			<Alert variant="success" role="note">
				Changes saved.
			</Alert>,
		)

		expect(screen.getByRole('note')).toHaveTextContent('Changes saved.')
	})
})
