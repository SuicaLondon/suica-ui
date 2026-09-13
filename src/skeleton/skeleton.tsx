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
	white: 'skeleton-white',
	accent: 'skeleton-accent',
	success: 'skeleton-success',
	warning: 'skeleton-warning',
	danger: 'skeleton-danger',
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
	function Skeleton({ className, tone = 'white', ...divProps }, ref) {
		return (
			<div
				ref={ref}
				data-slot="skeleton"
				data-tone={tone}
				className={cn(
					'box-border skeleton-shimmer rounded-control',
					'motion-reduce:animate-none',
					skeletonGradientClassNameByTone[tone],
					className,
				)}
				{...divProps}
				aria-hidden="true"
			/>
		)
	},
)
