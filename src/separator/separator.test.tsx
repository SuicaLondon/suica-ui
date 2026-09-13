import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Separator } from './index'

describe('Separator', () => {
	it('distinguishes decorative lines from semantic separators', () => {
		const ref = createRef<HTMLDivElement>()
		const { rerender } = render(<Separator ref={ref} />)
		expect(screen.queryByRole('separator')).not.toBeInTheDocument()
		expect(ref.current).toHaveAttribute('role', 'none')
		rerender(<Separator ref={ref} decorative={false} orientation="vertical" />)
		expect(screen.getByRole('separator')).toBe(ref.current)
		expect(ref.current).toHaveAttribute('aria-orientation', 'vertical')
		expect(ref.current).toHaveClass('w-px')
	})
})
