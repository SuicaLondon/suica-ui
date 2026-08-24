import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Icon } from './index'

describe('Icon', () => {
	it('is hidden from assistive technology when it is decorative', () => {
		const { container } = render(<Icon icon="heart" />)
		const icon = container.querySelector('svg')

		expect(icon).toHaveAttribute('aria-hidden', 'true')
		expect(icon).not.toHaveAttribute('role')
		expect(icon).toHaveAttribute('focusable', 'false')
	})

	it('uses a title as its accessible name', () => {
		render(<Icon icon="star-fill" title="Featured" />)

		const icon = screen.getByRole('img', { name: 'Featured' })
		expect(icon).not.toHaveAttribute('aria-hidden')
		expect(icon.querySelector('title')).toHaveTextContent('Featured')
	})

	it('supports aria-label, SVG props, classes, and a forwarded ref', () => {
		const ref = createRef<SVGSVGElement>()

		render(
			<Icon
				ref={ref}
				icon="heart-fill"
				aria-label="Liked"
				className="custom-icon"
				data-testid="liked-icon"
			/>,
		)

		const icon = screen.getByRole('img', { name: 'Liked' })
		expect(icon).toHaveClass('sui:size-5', 'custom-icon')
		expect(ref.current).toBe(screen.getByTestId('liked-icon'))
		expect(icon.querySelector('path')).toHaveAttribute('d')
	})

	it('renders the warning status icon used by alerts', () => {
		const { container } = render(<Icon icon="warning" />)
		const icon = container.querySelector('svg')

		expect(icon).toHaveAttribute('viewBox', '0 0 20 20')
		expect(icon).toHaveAttribute('aria-hidden', 'true')
		expect(icon?.querySelector('path')).toHaveAttribute('d')
	})
})
