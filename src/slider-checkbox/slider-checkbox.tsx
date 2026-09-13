'use client'

import {
	forwardRef,
	useState,
	type ChangeEvent,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
	type ReactElement,
	type RefAttributes,
} from 'react'
import { cn } from '../cn.js'

export interface DiscreteSliderProps<T> extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'defaultValue' | 'max' | 'min' | 'onChange' | 'step' | 'type' | 'value'
> {
	values: readonly T[]
	valueIndex?: number
	defaultValueIndex?: number
	getValueLabel?: (value: T, index: number) => string
	onValueChange?: (
		value: T,
		index: number,
		event: ChangeEvent<HTMLInputElement>,
	) => void
}

function clampIndex(index: number | undefined, length: number) {
	if (length === 0) return 0
	return Math.min(Math.max(index ?? 0, 0), length - 1)
}

function DiscreteSliderInner<T>(
	{
		values,
		valueIndex,
		defaultValueIndex,
		getValueLabel = (value) => String(value),
		onValueChange,
		className,
		disabled,
		style,
		...inputProps
	}: DiscreteSliderProps<T>,
	ref: ForwardedRef<HTMLInputElement>,
) {
	const [internalIndex, setInternalIndex] = useState(() =>
		clampIndex(defaultValueIndex, values.length),
	)
	const currentIndex = clampIndex(valueIndex ?? internalIndex, values.length)
	const isDisabled = disabled || values.length === 0
	const progress =
		values.length > 1 ? (currentIndex / (values.length - 1)) * 100 : 0

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const nextIndex = clampIndex(Number(event.currentTarget.value), values.length)
		if (valueIndex === undefined) setInternalIndex(nextIndex)

		if (values.length > 0) {
			onValueChange?.(values[nextIndex]!, nextIndex, event)
		}
	}

	return (
		<input
			ref={ref}
			type="range"
			min={0}
			max={Math.max(values.length - 1, 0)}
			step={1}
			value={currentIndex}
			disabled={isDisabled}
			aria-valuetext={
				values.length === 0
					? undefined
					: getValueLabel(values[currentIndex]!, currentIndex)
			}
			data-slot="discrete-slider"
			className={cn(
				'm-0 box-border h-11 w-64 max-w-full cursor-pointer',
				'appearance-none rounded-control border-0 bg-transparent p-0',
				'accent-accent outline-none focus-visible:outline-2',
				'focus-visible:outline-offset-2 focus-visible:outline-focus',
				'disabled:cursor-not-allowed disabled:opacity-50',
				'slider-control',
				className,
			)}
			style={{
				backgroundSize: `${progress}% 100%, 100% 100%`,
				...style,
			}}
			onChange={handleChange}
			{...inputProps}
		/>
	)
}

export const DiscreteSlider = forwardRef(DiscreteSliderInner) as <T>(
	props: DiscreteSliderProps<T> & RefAttributes<HTMLInputElement>,
) => ReactElement | null
