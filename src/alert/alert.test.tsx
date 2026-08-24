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
		expect(alert).toHaveClass(
			'custom-alert',
			'sui:border-danger-line',
			'sui:bg-danger-soft',
		)
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

		expect(screen.getByRole('note')).toHaveClass(
			'sui:bg-success-soft',
			'sui:text-foreground',
		)
	})

	it('resets title spacing and vertically aligns composed content', () => {
		render(
			<Alert
				icon={<span aria-hidden="true">!</span>}
				title="Draft has unpublished changes"
				action={<button type="button">Review</button>}
			>
				Publish when this version is ready for readers.
			</Alert>,
		)

		const alert = screen.getByRole('status')
		expect(alert).toHaveClass('sui:items-center')
		expect(screen.getByText('Draft has unpublished changes')).toHaveClass(
			'sui:m-0',
		)
		expect(alert.querySelector('[data-slot="alert-icon"]')).not.toHaveClass(
			'sui:mt-0.5',
		)
	})

	it('keeps alert copy neutral while applying the variant tone to adornments', () => {
		render(
			<Alert
				variant="warning"
				icon={<span aria-hidden="true">!</span>}
				title="Draft has unpublished changes"
				action={<button type="button">Review</button>}
			>
				Publish when this version is ready for readers.
			</Alert>,
		)

		const alert = screen.getByRole('alert')
		expect(alert).toHaveClass('sui:text-foreground')
		expect(alert.querySelector('[data-slot="alert-icon"]')).toHaveClass(
			'sui:text-warning',
		)
		expect(alert.querySelector('[data-slot="alert-description"]')).toHaveClass(
			'sui:text-muted',
		)
		expect(alert.querySelector('[data-slot="alert-action"]')).toHaveClass(
			'sui:text-warning',
		)
	})
})
