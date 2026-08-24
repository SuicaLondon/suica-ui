import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from '../input'
import { Label } from './index'

describe('Label', () => {
	it('uses native label semantics and forwards native props and ref', () => {
		const ref = createRef<HTMLLabelElement>()

		render(
			<>
				<Label ref={ref} htmlFor="display-name" data-context="profile">
					Display name
				</Label>
				<Input id="display-name" />
			</>,
		)

		const input = screen.getByLabelText('Display name')
		const label = screen.getByText('Display name')
		expect(input).toHaveAttribute('id', 'display-name')
		expect(ref.current).toBe(label)
		expect(label).toHaveAttribute('for', 'display-name')
		expect(label).toHaveAttribute('data-context', 'profile')
		expect(label).toHaveAttribute('data-slot', 'label')
		expect(label).toHaveClass(
			'sui:peer-disabled:cursor-not-allowed',
			'sui:peer-disabled:opacity-70',
		)
	})
})
