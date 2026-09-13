import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { LoadingIndicatorIcon } from './loading-indicator-icon.js'

export interface LoadingIndicatorProps extends Omit<
	ComponentPropsWithoutRef<'span'>,
	'children'
> {
	label: string
}

export const LoadingIndicator = forwardRef<
	HTMLSpanElement,
	LoadingIndicatorProps
>(function LoadingIndicator(
	{
		label,
		className,
		role = 'status',
		'aria-label': ariaLabel,
		'aria-live': ariaLive = 'polite',
		...indicatorProps
	},
	ref,
) {
	return (
		<span
			ref={ref}
			data-slot="loading-indicator"
			role={role}
			aria-label={ariaLabel ?? label}
			aria-live={ariaLive}
			className={cn(
				'inline-flex border-line bg-surface-elevated/95 text-muted',
				'box-border items-center gap-2 rounded-full whitespace-nowrap',
				'border px-3 py-2 text-xs font-medium',
				'font-sans',
				className,
			)}
			{...indicatorProps}
		>
			<LoadingIndicatorIcon />
			<span data-slot="loading-indicator-label">{label}</span>
		</span>
	)
})
