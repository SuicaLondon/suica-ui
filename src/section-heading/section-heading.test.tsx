import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { SectionHeading } from './index'

describe('SectionHeading', () => {
	it('renders an accessible heading and descriptive content while forwarding props', () => {
		const ref = createRef<HTMLDivElement>()

		render(
			<SectionHeading
				ref={ref}
				title="Location and language"
				titleId="audience-location"
				eyebrow="Audience"
				description="See where matching viewers come from."
				className="custom-heading"
				data-testid="heading-root"
			/>,
		)

		const root = screen.getByTestId('heading-root')
		const heading = screen.getByRole('heading', {
			level: 2,
			name: 'Location and language',
		})
		const eyebrow = screen.getByText('Audience')
		const description = screen.getByText('See where matching viewers come from.')

		expect(ref.current).toBe(root)
		expect(root).toHaveClass('custom-heading')
		expect(heading).toHaveAttribute('id', 'audience-location')

		expect(eyebrow.tagName).toBe('P')

		expect(description.tagName).toBe('P')
	})
})
