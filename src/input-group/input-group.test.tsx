import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Input } from '../input/index'
import { InputGroup, InputGroupAddon } from './index'

describe('InputGroup', () => {
	it('composes addons with a native input while forwarding every ref', async () => {
		const user = userEvent.setup()
		const groupRef = createRef<HTMLDivElement>()
		const addonRef = createRef<HTMLSpanElement>()
		const controlRef = createRef<HTMLInputElement>()

		render(
			<InputGroup ref={groupRef} data-testid="slug-group">
				<InputGroupAddon ref={addonRef}>/blogs/</InputGroupAddon>
				<Input
					ref={controlRef}
					aria-label="Post slug"
					name="slug"
					maxLength={100}
				/>
			</InputGroup>,
		)

		const group = screen.getByTestId('slug-group')
		const addon = screen.getByText('/blogs/')
		const control = screen.getByLabelText('Post slug')
		await user.type(control, 'suica-ui')

		expect(groupRef.current).toBe(group)
		expect(addonRef.current).toBe(addon)
		expect(controlRef.current).toBe(control)
		expect(group).toHaveAttribute('data-slot', 'input-group')
		expect(addon).toHaveAttribute('data-slot', 'input-group-addon')
		expect(control).toHaveAttribute('data-slot', 'input')
		expect(control).toHaveValue('suica-ui')
		expect(control).toHaveAttribute('name', 'slug')
		expect(control).toHaveAttribute('maxlength', '100')
	})

	it('keeps native control states and merges group and control classes', () => {
		render(
			<InputGroup data-testid="group" className="sui:max-w-lg">
				<Input
					aria-label="Search"
					type="search"
					aria-invalid="true"
					disabled
					className="sui:font-mono"
				/>
			</InputGroup>,
		)

		const group = screen.getByTestId('group')
		const control = screen.getByLabelText('Search')
		expect(group).toHaveClass('sui:max-w-lg')
		expect(group).toHaveClass('sui:has-[:disabled]:opacity-50')
		expect(control).toBeDisabled()
		expect(control).toHaveAttribute('type', 'search')
		expect(control).toHaveAttribute('aria-invalid', 'true')
		expect(control).toHaveClass('sui:font-mono', 'sui:w-full')
		expect(group).toHaveClass(
			'sui:min-h-9',
			'sui:focus-within:ring-1',
			'sui:[&_[data-slot=input]]:border-0',
			'sui:[&_[data-slot=input]]:rounded-none',
			'sui:[&_[data-slot=input]]:shadow-none',
			'sui:[&_[data-slot=input]]:focus-visible:ring-0',
		)
	})
})
