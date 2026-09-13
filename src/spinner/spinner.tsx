import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { SpinnerIcon } from './spinner-icon.js'

export type SpinnerState = 'determinate' | 'indeterminate'

export interface SpinnerProps extends Omit<
	ComponentPropsWithoutRef<'span'>,
	'aria-valuemax' | 'aria-valuemin' | 'aria-valuenow' | 'children' | 'role'
> {
	label: string
	percentage?: number
}

const spinnerClassNameByState: Record<SpinnerState, string> = {
	determinate: '',
	indeterminate: 'animate-spin will-change-transform motion-reduce:animate-none',
}

function normalizePercentage(percentage: number) {
	if (!Number.isFinite(percentage)) return undefined
	return Math.min(100, Math.max(0, percentage))
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
	function Spinner(
		{ label, percentage, className, 'aria-label': ariaLabel, ...spinnerProps },
		ref,
	) {
		let state: SpinnerState = 'indeterminate'
		let normalizedPercentage: number | undefined
		let strokeDashoffset = 0
		let ariaValueMin: number | undefined
		let ariaValueMax: number | undefined

		if (percentage !== undefined) {
			normalizedPercentage = normalizePercentage(percentage)

			if (normalizedPercentage !== undefined) {
				state = 'determinate'
				strokeDashoffset = 100 - normalizedPercentage
				ariaValueMin = 0
				ariaValueMax = 100
			}
		}

		return (
			<span
				ref={ref}
				{...spinnerProps}
				data-slot="spinner"
				data-state={state}
				data-percentage={normalizedPercentage}
				role="progressbar"
				aria-label={ariaLabel ?? label}
				aria-valuemin={ariaValueMin}
				aria-valuemax={ariaValueMax}
				aria-valuenow={normalizedPercentage}
				className={cn(
					'inline-flex size-3.5 shrink-0 items-center justify-center',
					spinnerClassNameByState[state],
					className,
				)}
			>
				<SpinnerIcon state={state} strokeDashoffset={strokeDashoffset} />
			</span>
		)
	},
)
