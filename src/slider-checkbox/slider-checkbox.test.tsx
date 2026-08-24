import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { DiscreteSlider } from './index'

describe('DiscreteSlider', () => {
	it('maps native range changes to values and indices', () => {
		const onValueChange = vi.fn()
		const ref = createRef<HTMLInputElement>()

		render(
			<DiscreteSlider
				ref={ref}
				aria-label="Density"
				values={['compact', 'comfortable', 'spacious']}
				defaultValueIndex={1}
				getValueLabel={(value) => `Density: ${value}`}
				onValueChange={onValueChange}
			/>,
		)

		const slider = screen.getByRole('slider', { name: 'Density' })
		expect(slider).toHaveAttribute('data-slot', 'discrete-slider')
		expect(slider).toHaveClass(
			'sui:appearance-none',
			'sui:[&::-webkit-slider-thumb]:appearance-none',
			'sui:[&::-moz-range-thumb]:bg-accent',
		)
		expect(slider).toHaveValue('1')
		expect(slider).toHaveAttribute('aria-valuetext', 'Density: comfortable')
		expect(ref.current).toBe(slider)

		fireEvent.change(slider, { target: { value: '2' } })

		expect(slider).toHaveValue('2')
		expect(slider).toHaveAttribute('aria-valuetext', 'Density: spacious')
		expect(onValueChange).toHaveBeenCalledWith(
			'spacious',
			2,
			expect.objectContaining({ type: 'change' }),
		)
	})

	it('leaves controlled selection in the caller and clamps out-of-range indices', () => {
		const onValueChange = vi.fn()
		const { rerender } = render(
			<DiscreteSlider
				aria-label="Priority"
				values={['low', 'high']}
				valueIndex={99}
				onValueChange={onValueChange}
			/>,
		)

		const slider = screen.getByRole('slider', { name: 'Priority' })
		expect(slider).toHaveValue('1')

		fireEvent.change(slider, { target: { value: '0' } })

		expect(onValueChange).toHaveBeenCalledWith('low', 0, expect.any(Object))
		expect(slider).toHaveValue('1')

		rerender(
			<DiscreteSlider
				aria-label="Priority"
				values={['low', 'high']}
				valueIndex={0}
			/>,
		)
		expect(slider).toHaveValue('0')
	})

	it('disables an empty value set without invoking callbacks', () => {
		const onValueChange = vi.fn()

		render(
			<DiscreteSlider
				aria-label="Empty scale"
				values={[]}
				onValueChange={onValueChange}
			/>,
		)

		const slider = screen.getByRole('slider', { name: 'Empty scale' })
		expect(slider).toBeDisabled()
		expect(slider).toHaveValue('0')
		expect(slider).not.toHaveAttribute('aria-valuetext')

		fireEvent.change(slider, { target: { value: '0' } })
		expect(onValueChange).not.toHaveBeenCalled()
	})
})
