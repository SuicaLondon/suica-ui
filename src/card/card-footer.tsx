import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const CardFooter = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<'div'>
>(function CardFooter({ className, ...divProps }, ref) {
	return (
		<div
			ref={ref}
			data-slot="card-footer"
			className={cn(
				'box-border flex items-center gap-2 px-6 pb-6',
				'first:pt-6',
				className,
			)}
			{...divProps}
		/>
	)
})
