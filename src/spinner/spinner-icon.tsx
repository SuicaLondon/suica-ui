import { cn } from '../cn.js'
import type { SpinnerState } from './spinner.js'

const indicatorDashArrayByState: Record<SpinnerState, string> = {
	determinate: '100 100',
	indeterminate: '80 20',
}

const indicatorClassNameByState: Record<SpinnerState, string> = {
	determinate:
		'sui:transition-[stroke-dashoffset] sui:duration-300 sui:ease-out sui:motion-reduce:transition-none',
	indeterminate: '',
}

const trackClassNameByState: Record<SpinnerState, string> = {
	determinate: 'sui:opacity-20',
	indeterminate: 'sui:opacity-0',
}

export interface SpinnerIconProps {
	state: SpinnerState
	strokeDashoffset: number
}

export function SpinnerIcon({ state, strokeDashoffset }: SpinnerIconProps) {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			viewBox="0 0 24 24"
			className="sui:size-full"
		>
			<circle
				data-slot="spinner-track"
				cx="12"
				cy="12"
				r="9"
				pathLength="100"
				fill="none"
				strokeWidth="2"
				className={cn('sui:stroke-current', trackClassNameByState[state])}
			/>
			<circle
				data-slot="spinner-indicator"
				cx="12"
				cy="12"
				r="9"
				pathLength="100"
				fill="none"
				strokeWidth="2"
				strokeLinecap="round"
				strokeDasharray={indicatorDashArrayByState[state]}
				strokeDashoffset={strokeDashoffset}
				transform="rotate(-90 12 12)"
				className={cn('sui:stroke-current', indicatorClassNameByState[state])}
			/>
		</svg>
	)
}
