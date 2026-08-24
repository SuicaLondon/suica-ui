import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Label } from '../label'
import { Select } from './index'

describe('Select', () => {
	it('keeps native form behavior and forwards its ref and props', async () => {
		const user = userEvent.setup()
		const ref = createRef<HTMLSelectElement>()

		render(
			<>
				<Label htmlFor="status">Status</Label>
				<Select ref={ref} id="status" name="status" defaultValue="draft" required>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
				</Select>
			</>,
		)

		const select = screen.getByLabelText('Status')
		await user.selectOptions(select, 'published')

		expect(ref.current).toBe(select)
		expect(select).toHaveValue('published')
		expect(select).toHaveAttribute('name', 'status')
		expect(select).toBeRequired()
		expect(select).toHaveAttribute('data-slot', 'select')
		expect(select).toHaveClass('sui:h-9')
		expect(select).toHaveClass('sui:bg-transparent')
		expect(select).toHaveClass('sui:focus-visible:ring-1')
	})

	it('supports native invalid and disabled states plus class overrides', () => {
		render(
			<Select
				aria-label="Language"
				aria-invalid="true"
				disabled
				className="sui:h-8"
			>
				<option>English</option>
			</Select>,
		)

		const select = screen.getByLabelText('Language')
		expect(select).toBeDisabled()
		expect(select).toHaveAttribute('aria-invalid', 'true')
		expect(select).toHaveClass('sui:h-8')
		expect(select).not.toHaveClass('sui:h-9')
	})
})
