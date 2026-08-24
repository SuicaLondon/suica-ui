import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Spinner } from './index'

describe('Spinner', () => {
	it('renders an accessible indeterminate progress ring', () => {
		const ref = createRef<HTMLSpanElement>()

		render(
			<Spinner
				ref={ref}
				label="Loading analytics"
				className="custom-spinner"
				data-testid="spinner"
			/>,
		)

		const spinner = screen.getByRole('progressbar', {
			name: 'Loading analytics',
		})
		const indicator = spinner.querySelector('[data-slot="spinner-indicator"]')

		expect(ref.current).toBe(spinner)
		expect(spinner).toHaveAttribute('data-state', 'indeterminate')
		expect(spinner).not.toHaveAttribute('aria-valuemin')
		expect(spinner).not.toHaveAttribute('aria-valuemax')
		expect(spinner).not.toHaveAttribute('aria-valuenow')
		expect(spinner).toHaveClass(
			'custom-spinner',
			'sui:size-3.5',
			'sui:animate-spin',
			'sui:motion-reduce:animate-none',
		)
		expect(spinner).not.toHaveClass('sui:size-12', 'sui:text-accent')
		const svg = spinner.querySelector('svg')
		const track = spinner.querySelector('[data-slot="spinner-track"]')

		expect(svg).toHaveAttribute('aria-hidden', 'true')
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
		expect(track).toHaveAttribute('r', '9')
		expect(track).toHaveAttribute('stroke-width', '2')
		expect(track).toHaveClass('sui:opacity-0')
		expect(indicator).toHaveAttribute('r', '9')
		expect(indicator).toHaveAttribute('pathLength', '100')
		expect(indicator).toHaveAttribute('stroke-width', '2')
		expect(indicator).toHaveAttribute('stroke-dasharray', '80 20')
	})

	it('maps percentage to the determinate ring closure', () => {
		const { rerender } = render(
			<Spinner
				label="Upload progress"
				aria-label="Uploading profile image"
				percentage={64}
			/>,
		)

		const spinner = screen.getByRole('progressbar', {
			name: 'Uploading profile image',
		})
		const indicator = spinner.querySelector('[data-slot="spinner-indicator"]')

		expect(spinner).toHaveAttribute('data-state', 'determinate')
		expect(spinner).toHaveAttribute('data-percentage', '64')
		expect(spinner).toHaveAttribute('aria-valuemin', '0')
		expect(spinner).toHaveAttribute('aria-valuemax', '100')
		expect(spinner).toHaveAttribute('aria-valuenow', '64')
		expect(spinner).toHaveClass('sui:size-3.5')
		expect(spinner).not.toHaveClass('sui:animate-spin')
		expect(spinner.querySelector('[data-slot="spinner-track"]')).toHaveClass(
			'sui:opacity-20',
		)
		expect(indicator).toHaveAttribute('stroke-dasharray', '100 100')
		expect(indicator).toHaveAttribute('stroke-dashoffset', '36')
		expect(indicator).toHaveClass(
			'sui:transition-[stroke-dashoffset]',
			'sui:motion-reduce:transition-none',
		)

		rerender(<Spinner label="Upload progress" percentage={25.5} />)

		expect(spinner).toHaveAttribute('aria-valuenow', '25.5')
		expect(indicator).toHaveAttribute('stroke-dashoffset', '74.5')

		rerender(<Spinner label="Upload progress" percentage={0} />)

		expect(spinner).toHaveAttribute('data-state', 'determinate')
		expect(spinner).toHaveAttribute('aria-valuenow', '0')
		expect(indicator).toHaveAttribute('stroke-dashoffset', '100')
	})

	it('clamps percentage to the supported zero-to-one-hundred range', () => {
		const { rerender } = render(
			<Spinner label="Import progress" percentage={120} />,
		)

		const spinner = screen.getByRole('progressbar', {
			name: 'Import progress',
		})
		const indicator = spinner.querySelector('[data-slot="spinner-indicator"]')

		expect(spinner).toHaveAttribute('aria-valuenow', '100')
		expect(indicator).toHaveAttribute('stroke-dashoffset', '0')

		rerender(<Spinner label="Import progress" percentage={-20} />)
		expect(spinner).toHaveAttribute('aria-valuenow', '0')
		expect(indicator).toHaveAttribute('stroke-dashoffset', '100')
	})

	it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
		'treats non-finite percentage %s as indeterminate',
		(percentage) => {
			render(<Spinner label="Import progress" percentage={percentage} />)

			const spinner = screen.getByRole('progressbar', {
				name: 'Import progress',
			})
			const indicator = spinner.querySelector('[data-slot="spinner-indicator"]')

			expect(spinner).toHaveAttribute('data-state', 'indeterminate')
			expect(spinner).not.toHaveAttribute('aria-valuemin')
			expect(spinner).not.toHaveAttribute('aria-valuemax')
			expect(spinner).not.toHaveAttribute('aria-valuenow')
			expect(spinner).toHaveClass('sui:animate-spin')
			expect(indicator).toHaveAttribute('stroke-dasharray', '80 20')
		},
	)
})
