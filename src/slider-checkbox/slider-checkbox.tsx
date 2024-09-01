import clsx from 'clsx'
import { ChangeEvent, HTMLAttributes } from 'react'

export interface ISliderCheckboxProps<T>
	extends HTMLAttributes<HTMLButtonElement> {
	selectedIndex: number
	values: T[]
	onChecked: (value: T, index: number) => void
}

export function SliderCheckbox<T>({
	selectedIndex,
	values,
	onChecked,
}: ISliderCheckboxProps<T>) {
	return (
		<input
			type="range"
			className={clsx(
				'm-1 h-4 cursor-pointer appearance-none bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50',
				'[&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
				'[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-slider-thumb',
				'[&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-full',
				'[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-primary-gray',
				'[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full',
				'[&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary-gray [&::-moz-range-thumb]:bg-white',
				'[&::-moz-range-track]:h-2 [&::-moz-range-track]:w-full [&::-moz-range-track]:rounded-full',
				'[&::-moz-range-track]:bg-primary-gray',
			)}
			min={0}
			max={values.length - 1}
			value={selectedIndex}
			onChange={(e: ChangeEvent<HTMLInputElement>) => {
				const index = +e.target.value
				onChecked(values[index], index)
			}}
		/>
	)
}
