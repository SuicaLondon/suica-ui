import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { ScalableTag, TagCloud } from './index'
import { Icon } from '../icons/index'

describe('ScalableTag', () => {
	it('exposes the label and count while keeping the prefix decorative', () => {
		render(
			<TagCloud aria-label="Topics">
				<li>
					<ScalableTag href="/tags/react" count={8}>
						React
					</ScalableTag>
				</li>
			</TagCloud>,
		)
		expect(screen.getByRole('list', { name: 'Topics' })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /React\s*:\s*8/ })).toHaveAttribute(
			'href',
			'/tags/react',
		)
		expect(screen.getByText('#')).toHaveAttribute('aria-hidden', 'true')
	})

	it('accepts custom prefix content and styling, or no prefix', () => {
		const { rerender } = render(
			<ScalableTag
				count={2}
				prefix={<Icon icon="star-fill" data-testid="icon" />}
				prefixClassName="custom-prefix"
			>
				React
			</ScalableTag>,
		)
		expect(screen.getByTestId('icon').parentElement).toHaveClass('custom-prefix')
		rerender(
			<ScalableTag count={2} prefix={null}>
				React
			</ScalableTag>,
		)
		expect(document.querySelector('[data-slot="scalable-tag-prefix"]')).toBeNull()
	})

	it.each([
		[1, 'text-base'],
		[2, 'text-xl'],
		[3, 'text-2xl'],
		[5, 'text-3xl'],
		[8, 'text-4xl'],
	])('uses the size tier at count %s', (count, size) => {
		render(
			<ScalableTag href="#react" count={count}>
				React
			</ScalableTag>,
		)
		expect(screen.getByRole('link')).toHaveClass(size)
	})

	it('forwards ref, content and native behavior through a custom link', async () => {
		const ref = createRef<HTMLAnchorElement>()
		const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault())
		render(
			<ScalableTag
				ref={ref}
				count={0}
				href="#react"
				onClick={onClick}
				className="custom-tag"
				render={(props) => <a {...props} data-router="custom" />}
			>
				React
			</ScalableTag>,
		)
		const link = screen.getByRole('link', { name: /React\s*:\s*0/ })
		expect(ref.current).toBe(link)
		expect(link).toHaveClass('custom-tag')
		expect(link).toHaveAttribute('data-router', 'custom')
		await userEvent.tab()
		expect(link).toHaveFocus()
		await userEvent.keyboard('{Enter}')
		expect(onClick).toHaveBeenCalledOnce()
	})
})
