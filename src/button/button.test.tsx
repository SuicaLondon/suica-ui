import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Button, buttonClassName } from './index'

describe('Button', () => {
	it('forwards native props, events, and its ref', async () => {
		const user = userEvent.setup()
		const onClick = vi.fn()
		const ref = createRef<HTMLButtonElement>()

		render(
			<Button ref={ref} type="submit" name="intent" value="save" onClick={onClick}>
				Save changes
			</Button>,
		)

		const button = screen.getByRole('button', { name: 'Save changes' })
		expect(button).toHaveAttribute('type', 'submit')
		expect(button).toHaveAttribute('name', 'intent')
		expect(button).toHaveAttribute('value', 'save')
		expect(ref.current).toBe(button)

		await user.click(button)
		expect(onClick).toHaveBeenCalledOnce()
	})

	it('exposes mapped variants and sizes for buttons and links', () => {
		render(
			<Button variant="outline" size="sm" disabled>
				Unavailable
			</Button>,
		)

		const button = screen.getByRole('button', { name: 'Unavailable' })
		expect(button).toBeDisabled()
		expect(button).toHaveAttribute('type', 'button')
		expect(button).toHaveAttribute('data-variant', 'outline')
		expect(button).toHaveAttribute('data-size', 'sm')
		expect(button).toHaveClass(
			'sui:box-border',
			'sui:border-line-strong',
			'sui:min-h-9',
		)

		const linkClasses = buttonClassName({
			variant: 'ghost',
			size: 'icon',
			className: 'custom-link',
		})
		expect(linkClasses).toContain('sui:bg-transparent')
		expect(linkClasses).toContain('sui:size-11')
		expect(linkClasses).toContain('custom-link')
	})

	it('provides a compact, inherited-tone action style', () => {
		render(
			<Button variant="subtle" size="xs">
				Review
			</Button>,
		)

		const button = screen.getByRole('button', { name: 'Review' })
		expect(button).toHaveAttribute('data-variant', 'subtle')
		expect(button).toHaveAttribute('data-size', 'xs')
		expect(button).toHaveClass(
			'sui:border-current',
			'sui:text-current',
			'sui:min-h-8',
			'sui:hover:bg-current/5',
		)
	})
})
