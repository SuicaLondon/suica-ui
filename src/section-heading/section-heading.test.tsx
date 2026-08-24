import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { SectionHeading } from './index'

describe('SectionHeading', () => {
	it('matches the Blog analytics heading layout and forwards native props', () => {
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
		expect(root).toHaveClass(
			'custom-heading',
			'sui:items-center',
			'sui:gap-3',
			'sui:px-1',
		)
		expect(heading).toHaveAttribute('id', 'audience-location')
		expect(heading).toHaveClass(
			'sui:m-0',
			'sui:shrink-0',
			'sui:text-lg',
			'sui:font-semibold',
			'sui:tracking-tight',
		)
		expect(eyebrow.tagName).toBe('P')
		expect(eyebrow).toHaveClass(
			'sui:m-0',
			'sui:shrink-0',
			'sui:text-[11px]',
			'sui:font-semibold',
			'sui:tracking-[0.14em]',
			'sui:text-muted',
			'sui:uppercase',
		)
		expect(description.tagName).toBe('P')
		expect(description).toHaveClass(
			'sui:m-0',
			'sui:ml-auto',
			'sui:hidden',
			'sui:truncate',
			'sui:text-sm',
			'sui:text-muted',
			'sui:sm:block',
		)
	})
})
