import { cn } from '../cn.js'
export function CheckboxIndicatorIcon() {
	return (
		<svg
			aria-hidden="true"
			data-slot="checkbox-indicator"
			focusable="false"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn(
				'pointer-events-none col-start-1 text-surface-elevated',
				'row-start-1 m-auto size-3.5 opacity-0 transition-opacity',
				'peer-checked:opacity-100 peer-disabled:text-surface-elevated/50',
			)}
		>
			<path d="m5 12 4 4L19 6" />
		</svg>
	)
}
