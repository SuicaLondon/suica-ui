import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Overlay } from './index'

describe('Overlay', () => {
	it('provides only the visual layer and leaves content composable', () => {
		const ref = createRef<HTMLDivElement>()

		render(
			<Overlay ref={ref} data-testid="overlay" className="custom-overlay">
				<span>Independent content</span>
			</Overlay>,
		)

		const overlay = screen.getByTestId('overlay')
		expect(ref.current).toBe(overlay)
		expect(overlay).toHaveAttribute('data-slot', 'overlay')
		expect(overlay).toHaveClass('sui:absolute', 'sui:inset-0', 'custom-overlay')
		expect(overlay).not.toHaveClass('sui:pointer-events-none')
		expect(overlay).not.toHaveAttribute('role')
		expect(screen.getByText('Independent content')).toBeInTheDocument()
	})

	it('supports a viewport-level fixed layer', () => {
		render(<Overlay className="sui:fixed" data-testid="fixed-overlay" />)

		const overlay = screen.getByTestId('fixed-overlay')
		expect(overlay).toHaveClass('sui:fixed')
		expect(overlay).not.toHaveClass('sui:absolute')
	})
})
