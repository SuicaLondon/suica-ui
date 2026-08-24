import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Field } from './index'

describe('Field', () => {
	it('owns the accessible label, description, error, and generated ids', () => {
		render(
			<Field
				label="Post title"
				description="Shown as the page heading."
				error="A title is required."
			>
				<Input aria-describedby="external-help" />
			</Field>,
		)

		const input = screen.getByLabelText('Post title')
		const description = screen.getByText('Shown as the page heading.')
		const error = screen.getByText('A title is required.')
		const field = input.closest('[data-slot="field"]')
		const describedBy = input.getAttribute('aria-describedby')?.split(' ')

		expect(input.id).not.toBe('')
		expect(description).toHaveAttribute('id', `${input.id}-description`)
		expect(error).toHaveAttribute('id', `${input.id}-error`)
		expect(describedBy).toEqual([
			'external-help',
			`${input.id}-description`,
			`${input.id}-error`,
		])
		expect(input).toHaveAttribute('aria-invalid', 'true')
		expect(input).toHaveAccessibleDescription(
			'Shown as the page heading. A title is required.',
		)
		expect(field).toHaveAttribute('data-invalid', 'true')
		expect(field).toHaveClass('sui:gap-2')
		expect(description).toHaveClass('sui:m-0')
		expect(error).toHaveClass('sui:m-0')
	})

	it('preserves child native props, control ref, field ref, id, and interaction', async () => {
		const user = userEvent.setup()
		const controlRef = createRef<HTMLInputElement>()
		const fieldRef = createRef<HTMLDivElement>()

		render(
			<Field ref={fieldRef} label="Title" data-context="editor">
				<Input
					ref={controlRef}
					id="post-title"
					name="title"
					type="search"
					maxLength={24}
					required
				/>
			</Field>,
		)

		const input = screen.getByLabelText('Title')
		await user.type(input, 'Suica UI')

		expect(controlRef.current).toBe(input)
		expect(fieldRef.current).toBe(input.closest('[data-slot="field"]'))
		expect(fieldRef.current).toHaveAttribute('data-context', 'editor')
		expect(input).toHaveAttribute('id', 'post-title')
		expect(input).toHaveAttribute('name', 'title')
		expect(input).toHaveAttribute('type', 'search')
		expect(input).toHaveAttribute('maxlength', '24')
		expect(input).toBeRequired()
		expect(input).toHaveValue('Suica UI')
		expect(input).not.toHaveAttribute('aria-describedby')
		expect(input).not.toHaveAttribute('aria-invalid')
	})

	it('supports any control that forwards native field props', () => {
		render(
			<Field label="Content" description="Markdown is supported.">
				<Textarea rows={12} />
			</Field>,
		)

		const textarea = screen.getByLabelText('Content')
		expect(textarea).toHaveAttribute('rows', '12')
		expect(textarea).toHaveAccessibleDescription('Markdown is supported.')
		expect(textarea).not.toHaveAttribute('aria-invalid')
	})

	it('reflects disabled and caller-provided aria-invalid states', () => {
		const { rerender } = render(
			<Field label="Slug">
				<Input disabled defaultValue="fixed-slug" aria-invalid="grammar" />
			</Field>,
		)

		const input = screen.getByLabelText('Slug')
		const field = input.closest('[data-slot="field"]')
		expect(input).toBeDisabled()
		expect(input).toHaveAttribute('aria-invalid', 'grammar')
		expect(field).toHaveAttribute('data-disabled', 'true')
		expect(field).toHaveAttribute('data-invalid', 'true')

		rerender(
			<Field label="Slug">
				<Input aria-invalid={false} />
			</Field>,
		)
		expect(screen.getByLabelText('Slug')).toHaveAttribute('aria-invalid', 'false')
		expect(
			screen.getByLabelText('Slug').closest('[data-slot="field"]'),
		).not.toHaveAttribute('data-invalid')
	})

	it('does not manufacture message ids when content is absent', () => {
		render(
			<Field label="Search" description={false} error={null}>
				<Input />
			</Field>,
		)

		const input = screen.getByLabelText('Search')
		expect(input).not.toHaveAttribute('aria-describedby')
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})
})
