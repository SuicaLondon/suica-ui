import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type SkeletonTone = 'white' | 'accent' | 'success' | 'warning' | 'danger'

export interface SkeletonProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'aria-hidden' | 'children'
> {
	tone?: SkeletonTone
}

const skeletonGradientClassNameByTone: Record<SkeletonTone, string> = {
	white:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,var(--sui-theme-skeleton-highlight)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	accent:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-accent)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	success:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-success)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	warning:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-warning)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	danger:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-danger)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
	function Skeleton({ className, tone = 'white', ...divProps }, ref) {
		return (
			<div
				ref={ref}
				data-slot="skeleton"
				data-tone={tone}
				className={cn(
					'sui:box-border sui:animate-skeleton-shimmer sui:rounded-control sui:bg-[length:200%_100%] sui:motion-reduce:animate-none',
					skeletonGradientClassNameByTone[tone],
					className,
				)}
				{...divProps}
				aria-hidden="true"
			/>
		)
	},
)
