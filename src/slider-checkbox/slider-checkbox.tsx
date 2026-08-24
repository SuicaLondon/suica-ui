import {
	forwardRef,
	useState,
	type ChangeEvent,
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type ForwardedRef,
	type ReactElement,
	type RefAttributes,
} from 'react'
import { cn } from '../cn.js'

export interface DiscreteSliderProps<T>
	extends Omit<
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
	const sliderStyle = {
		'--sui-slider-progress': `${progress}%`,
		...style,
	} as CSSProperties

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
				'sui:m-0 sui:h-11 sui:w-64 sui:max-w-full sui:box-border sui:cursor-pointer sui:appearance-none sui:rounded-control sui:border-0 sui:bg-transparent sui:p-0 sui:accent-accent sui:outline-none sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-2 sui:disabled:cursor-not-allowed sui:disabled:opacity-50 sui:[--sui-slider-direction:to_right] sui:[--sui-slider-progress:0%] sui:rtl:[--sui-slider-direction:to_left]',
				'sui:[&::-webkit-slider-runnable-track]:h-1 sui:[&::-webkit-slider-runnable-track]:rounded-full sui:[&::-webkit-slider-runnable-track]:border-0 sui:[&::-webkit-slider-runnable-track]:[background:linear-gradient(var(--sui-slider-direction),var(--sui-theme-accent)_0_var(--sui-slider-progress),var(--sui-theme-line-strong)_var(--sui-slider-progress)_100%)] sui:[&::-webkit-slider-thumb]:mt-[-7px] sui:[&::-webkit-slider-thumb]:size-[18px] sui:[&::-webkit-slider-thumb]:appearance-none sui:[&::-webkit-slider-thumb]:rounded-full sui:[&::-webkit-slider-thumb]:border-2 sui:[&::-webkit-slider-thumb]:border-surface sui:[&::-webkit-slider-thumb]:bg-accent sui:[&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--sui-theme-accent)] sui:[&::-webkit-slider-thumb]:transition-shadow sui:[&::-webkit-slider-thumb]:duration-150 sui:[&::-webkit-slider-thumb]:ease-[ease] sui:hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--sui-theme-accent-halo)] sui:focus-visible:[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--sui-theme-accent-halo)] sui:motion-reduce:[&::-webkit-slider-thumb]:transition-none',
				'sui:[&::-moz-range-track]:h-1 sui:[&::-moz-range-track]:rounded-full sui:[&::-moz-range-track]:border-0 sui:[&::-moz-range-track]:[background:var(--sui-theme-line-strong)] sui:[&::-moz-range-progress]:h-1 sui:[&::-moz-range-progress]:rounded-full sui:[&::-moz-range-progress]:[background:var(--sui-theme-accent)] sui:[&::-moz-range-thumb]:size-[14px] sui:[&::-moz-range-thumb]:rounded-full sui:[&::-moz-range-thumb]:border-2 sui:[&::-moz-range-thumb]:border-surface sui:[&::-moz-range-thumb]:bg-accent sui:[&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--sui-theme-accent)] sui:[&::-moz-range-thumb]:transition-shadow sui:[&::-moz-range-thumb]:duration-150 sui:[&::-moz-range-thumb]:ease-[ease] sui:hover:[&::-moz-range-thumb]:shadow-[0_0_0_4px_var(--sui-theme-accent-halo)] sui:focus-visible:[&::-moz-range-thumb]:shadow-[0_0_0_4px_var(--sui-theme-accent-halo)] sui:motion-reduce:[&::-moz-range-thumb]:transition-none',
				className,
			)}
			style={sliderStyle}
			onChange={handleChange}
			{...inputProps}
		/>
	)
}

export const DiscreteSlider = forwardRef(DiscreteSliderInner) as <T>(
	props: DiscreteSliderProps<T> & RefAttributes<HTMLInputElement>,
) => ReactElement | null
