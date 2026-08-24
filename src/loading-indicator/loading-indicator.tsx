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
				'sui:border-line sui:bg-surface-elevated/95 sui:text-muted sui:inline-flex sui:box-border sui:items-center sui:gap-2 sui:whitespace-nowrap sui:rounded-full sui:border sui:px-3 sui:py-2 sui:text-xs sui:font-medium sui:shadow-sm sui:font-[family-name:var(--sui-theme-font-sans)]',
				className,
			)}
			{...indicatorProps}
		>
			<LoadingIndicatorIcon />
			<span data-slot="loading-indicator-label">{label}</span>
		</span>
	)
})
