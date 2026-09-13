import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type TagCloudProps = ComponentPropsWithoutRef<'ul'>

/** Wrap each ScalableTag in an li to preserve native list semantics. */
export const TagCloud = forwardRef<HTMLUListElement, TagCloudProps>(
	function TagCloud({ className, ...props }, ref) {
		return (
			<ul
				ref={ref}
				data-slot="tag-cloud"
				className={cn(
					'm-0 flex max-w-270 list-none flex-wrap',
					'items-baseline gap-x-7 gap-y-5.5 p-0 max-md:gap-x-5',
					'max-md:gap-y-4.5',
					className,
				)}
				{...props}
			/>
		)
	},
)
