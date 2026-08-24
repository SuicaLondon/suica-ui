import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { LoadingIndicator } from './index'

describe('LoadingIndicator', () => {
	it('owns the visible loading treatment and polite status semantics', () => {
		const ref = createRef<HTMLSpanElement>()

		render(
			<LoadingIndicator
				ref={ref}
				label="Refreshing analytics"
				data-testid="indicator"
				className="custom-indicator"
			/>,
		)

		const indicator = screen.getByRole('status', {
			name: 'Refreshing analytics',
		})
		expect(ref.current).toBe(indicator)
		expect(indicator).toBe(screen.getByTestId('indicator'))
		expect(indicator).toHaveAttribute('data-slot', 'loading-indicator')
		expect(indicator).toHaveAttribute('aria-live', 'polite')
		expect(indicator).toHaveClass(
			'sui:rounded-full',
			'sui:shadow-sm',
			'custom-indicator',
		)
		expect(screen.getByText('Refreshing analytics')).toHaveAttribute(
			'data-slot',
			'loading-indicator-label',
		)
		expect(
			indicator.querySelector('[data-slot="loading-indicator-icon"]'),
		).toHaveAttribute('aria-hidden', 'true')
	})

	it('allows native status attributes to be overridden', () => {
		render(
			<LoadingIndicator
				label="Publishing"
				aria-label="Publishing the post"
				aria-live="assertive"
			/>,
		)

		const indicator = screen.getByRole('status', {
			name: 'Publishing the post',
		})
		expect(indicator).toHaveAttribute('aria-live', 'assertive')
		expect(indicator).toHaveTextContent('Publishing')
	})
})
