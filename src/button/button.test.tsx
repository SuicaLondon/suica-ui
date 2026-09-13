import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, type SubmitEvent as ReactSubmitEvent } from 'react'
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
		expect(button).toHaveClass('box-border', 'border-line-strong', 'min-h-9')

		const linkClasses = buttonClassName({
			variant: 'ghost',
			size: 'icon',
			className: 'custom-link',
		})
		expect(linkClasses).toContain('bg-transparent')
		expect(linkClasses).toContain('size-11')
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
			'border-current',
			'text-current',
			'min-h-8',
			'hover:bg-current/5',
		)
	})

	it('returns stable classes for every public variant and size', () => {
		const variants = [
			'default',
			'destructive',
			'outline',
			'secondary',
			'subtle',
			'ghost',
			'link',
		] as const
		const sizes = ['default', 'xs', 'sm', 'lg', 'icon'] as const
		for (const variant of variants) {
			for (const size of sizes) {
				const first = buttonClassName({ variant, size })
				expect(first).toBe(buttonClassName({ variant, size }))
				expect(first).toContain('inline-flex')
			}
		}
	})

	it('does not submit a form unless type submit is explicit', async () => {
		const user = userEvent.setup()
		const onSubmit = vi.fn((event: ReactSubmitEvent<HTMLFormElement>) =>
			event.preventDefault(),
		)
		render(
			<form onSubmit={onSubmit}>
				<Button>Safe action</Button>
				<Button type="submit">Submit form</Button>
			</form>,
		)
		await user.click(screen.getByRole('button', { name: 'Safe action' }))
		expect(onSubmit).not.toHaveBeenCalled()
		await user.click(screen.getByRole('button', { name: 'Submit form' }))
		expect(onSubmit).toHaveBeenCalledOnce()
	})
})
