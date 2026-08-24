import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type BadgeVariant =
	'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
export type BadgeSize = 'sm' | 'md'

const badgeVariantClassName: Record<BadgeVariant, string> = {
	default: 'sui:border-accent sui:bg-accent sui:text-surface',
	secondary:
		'sui:border-line-strong sui:bg-surface-elevated sui:text-foreground',
	outline: 'sui:border-line-strong sui:bg-transparent sui:text-foreground',
	destructive: 'sui:border-danger-line sui:bg-danger-soft sui:text-danger',
	success: 'sui:border-success-line sui:bg-success-soft sui:text-success',
	warning: 'sui:border-warning-line sui:bg-warning-soft sui:text-warning',
}

const badgeSizeClassName: Record<BadgeSize, string> = {
	sm: 'sui:min-h-5 sui:px-1.5 sui:py-0.5 sui:text-[0.6875rem]',
	md: 'sui:min-h-6 sui:px-2 sui:py-0.5 sui:text-xs',
}

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
	variant?: BadgeVariant
	size?: BadgeSize
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
	{ variant = 'default', size = 'md', className, ...spanProps },
	ref,
) {
	return (
		<span
			ref={ref}
			data-slot="badge"
			data-variant={variant}
			data-size={size}
			className={cn(
				'sui:inline-flex sui:w-fit sui:box-border sui:shrink-0 sui:items-center sui:justify-center sui:gap-1 sui:rounded-control sui:border sui:font-medium sui:leading-none sui:[font-family:var(--sui-theme-font-mono)]',
				badgeVariantClassName[variant],
				badgeSizeClassName[size],
				className,
			)}
			{...spanProps}
		/>
	)
})
