import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type BadgeVariant =
	'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
export type BadgeSize = 'sm' | 'md'

const badgeVariantClassName: Record<BadgeVariant, string> = {
	default: 'border-accent bg-accent text-surface',
	secondary: 'border-line-strong bg-surface-elevated text-foreground',
	outline: 'border-line-strong bg-transparent text-foreground',
	destructive: 'border-danger-line bg-danger-soft text-danger',
	success: 'border-success-line bg-success-soft text-success',
	warning: 'border-warning-line bg-warning-soft text-warning',
}

const badgeSizeClassName: Record<BadgeSize, string> = {
	sm: 'min-h-5 px-1.5 py-0.5 text-badge-sm',
	md: 'min-h-6 px-2 py-0.5 text-xs',
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
				'box-border inline-flex w-fit shrink-0 items-center',
				'justify-center gap-1 rounded-control border font-medium',
				'font-mono leading-none',
				badgeVariantClassName[variant],
				badgeSizeClassName[size],
				className,
			)}
			{...spanProps}
		/>
	)
})
