import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Skeleton } from './index'

describe('Skeleton', () => {
	it('is decorative by default and forwards native props and its ref', () => {
		const ref = createRef<HTMLDivElement>()
		render(
			<Skeleton ref={ref} data-testid="loading-preview" className="h-12 w-48" />,
		)

		const skeleton = screen.getByTestId('loading-preview')
		expect(skeleton).toHaveAttribute('aria-hidden', 'true')
		expect(skeleton).toHaveAttribute('data-tone', 'white')
		expect(skeleton).toHaveClass('h-12', 'w-48')
		expect(ref.current).toBe(skeleton)
	})
})
