import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
	createRef,
	type ForwardRefExoticComponent,
	type RefAttributes,
} from 'react'
import {
	HeartCheckbox,
	StarCheckbox,
	type HeartCheckboxProps,
	type StarCheckboxProps,
} from './index'

type CheckboxComponent = ForwardRefExoticComponent<
	(HeartCheckboxProps | StarCheckboxProps) & RefAttributes<HTMLInputElement>
>

describe.each([
	['HeartCheckbox', HeartCheckbox as CheckboxComponent],
	['StarCheckbox', StarCheckbox as CheckboxComponent],
])('%s', (_name, Checkbox) => {
	it('exposes native checkbox behavior with an accessible label', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		const ref = createRef<HTMLInputElement>()

		render(
			<Checkbox
				ref={ref}
				endLabel="Favorite"
				name="favorite"
				onChange={onChange}
			/>,
		)

		const checkbox = screen.getByRole('checkbox', { name: 'Favorite' })
		expect(checkbox).not.toBeChecked()
		expect(checkbox).toHaveAttribute('name', 'favorite')
		expect(ref.current).toBe(checkbox)

		await user.click(checkbox)

		expect(checkbox).toBeChecked()
		expect(onChange).toHaveBeenCalledTimes(1)
	})

	it('supports start labels, controlled state, and disabled inputs', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()

		render(<Checkbox startLabel="Pinned" checked disabled onChange={onChange} />)

		const checkbox = screen.getByRole('checkbox', { name: 'Pinned' })
		expect(checkbox).toBeChecked()
		expect(checkbox).toBeDisabled()

		await user.click(checkbox)
		expect(onChange).not.toHaveBeenCalled()
	})
})
