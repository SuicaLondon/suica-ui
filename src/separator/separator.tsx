import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export interface SeparatorProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'role' | 'aria-orientation'
> {
	orientation?: 'horizontal' | 'vertical'
	/** Decorative separators are hidden from assistive technology. */
	decorative?: boolean
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
	function Separator(
		{ orientation = 'horizontal', decorative = true, className, ...props },
		ref,
	) {
		return (
			<div
				{...props}
				ref={ref}
				role={decorative ? 'none' : 'separator'}
				aria-orientation={decorative ? undefined : orientation}
				data-slot="separator"
				data-orientation={orientation}
				className={cn(
					'shrink-0 bg-line',
					orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
					className,
				)}
			/>
		)
	},
)
