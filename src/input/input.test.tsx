import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from './index'

describe('Input', () => {
	it('forwards its ref and all native input props', () => {
		const ref = createRef<HTMLInputElement>()

		render(
			<Input
				ref={ref}
				aria-label="Publish date"
				type="date"
				name="publishedAt"
				required
				max="2027-01-01"
				data-source="dashboard"
			/>,
		)

		const input = screen.getByLabelText('Publish date')
		expect(ref.current).toBe(input)
		expect(input).toHaveAttribute('type', 'date')
		expect(input).toHaveAttribute('name', 'publishedAt')
		expect(input).toBeRequired()
		expect(input).toHaveAttribute('max', '2027-01-01')
		expect(input).toHaveAttribute('data-source', 'dashboard')
		expect(input).toHaveAttribute('data-slot', 'input')
		expect(input).toHaveClass(
			'sui:box-border',
			'sui:h-9',
			'sui:rounded-control',
			'sui:bg-transparent',
			'sui:py-1',
			'sui:focus-visible:ring-1',
		)
	})

	it('exposes invalid and disabled states to native accessibility APIs', () => {
		render(
			<Input
				aria-label="Title"
				aria-invalid="true"
				disabled
				className="sui:h-8"
			/>,
		)

		const input = screen.getByLabelText('Title')
		expect(input).toBeDisabled()
		expect(input).toHaveAttribute('aria-invalid', 'true')
		expect(input).toHaveClass('sui:h-8')
		expect(input).not.toHaveClass('sui:h-9')
	})
})
