import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Badge } from './index'

describe('Badge', () => {
	it('renders a native span and forwards props and its ref', () => {
		const ref = createRef<HTMLSpanElement>()
		render(
			<Badge ref={ref} title="Publication status" variant="outline" size="sm">
				Draft
			</Badge>,
		)

		const badge = screen.getByText('Draft')
		expect(badge.tagName).toBe('SPAN')
		expect(badge).toHaveAttribute('title', 'Publication status')
		expect(badge).toHaveAttribute('data-variant', 'outline')
		expect(badge).toHaveAttribute('data-size', 'sm')
		expect(badge).toHaveClass('sui:border-line-strong', 'sui:min-h-5')
		expect(ref.current).toBe(badge)
	})

	it('preserves consumer class names alongside mapped utilities', () => {
		render(<Badge className="custom-badge">Published</Badge>)
		const badge = screen.getByText('Published')
		expect(badge).toHaveClass('custom-badge', 'sui:px-2')
	})
})
