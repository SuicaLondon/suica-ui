import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './index'

describe('Card', () => {
	it('supports named and compound composition with semantic title content', () => {
		render(
			<Card aria-label="Analytics">
				<Card.Header>
					<Card.Title>Visitors</Card.Title>
					<Card.Description>Last 30 days</Card.Description>
				</Card.Header>
				<Card.Content>12,480</Card.Content>
				<Card.Footer>Updated today</Card.Footer>
			</Card>,
		)

		const card = screen.getByLabelText('Analytics')
		expect(card).toHaveAttribute('data-slot', 'card')
		expect(card).toHaveClass('sui:rounded-panel', 'sui:shadow-sm')
		expect(
			screen.getByRole('heading', { name: 'Visitors', level: 3 }),
		).toBeVisible()
		const title = screen.getByRole('heading', { name: 'Visitors', level: 3 })
		const description = screen.getByText('Last 30 days')
		const content = screen.getByText('12,480')
		const footer = screen.getByText('Updated today')
		expect(title).toHaveClass('sui:m-0', 'sui:leading-none')
		expect(description.tagName).toBe('P')
		expect(description).toHaveClass('sui:m-0', 'sui:leading-5')
		expect(title.parentElement).toHaveClass('sui:gap-1.5', 'sui:p-6')
		expect(content).toHaveAttribute('data-slot', 'card-content')
		expect(content).toHaveClass('sui:px-6', 'sui:pb-6', 'sui:first:pt-6')
		expect(footer).toHaveAttribute('data-slot', 'card-footer')
		expect(footer).toHaveClass(
			'sui:gap-2',
			'sui:px-6',
			'sui:pb-6',
			'sui:first:pt-6',
		)
	})

	it('forwards refs and native props from every named primitive', () => {
		const cardRef = createRef<HTMLDivElement>()
		const titleRef = createRef<HTMLHeadingElement>()
		render(
			<Card ref={cardRef} data-testid="card" className="custom-card">
				<CardHeader>
					<CardTitle ref={titleRef} level={2}>
						Settings
					</CardTitle>
					<CardDescription>Description</CardDescription>
				</CardHeader>
				<CardContent>Content</CardContent>
				<CardFooter>Footer</CardFooter>
			</Card>,
		)

		expect(cardRef.current).toBe(screen.getByTestId('card'))
		expect(titleRef.current).toBe(
			screen.getByRole('heading', { name: 'Settings' }),
		)
		expect(cardRef.current).toHaveClass('custom-card', 'sui:border-line')
		expect(titleRef.current).toHaveAttribute('data-level', '2')
		expect(titleRef.current).toHaveProperty('tagName', 'H2')
	})
})
