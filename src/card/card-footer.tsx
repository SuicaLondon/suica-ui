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
				'sui:flex sui:box-border sui:items-center sui:gap-2 sui:px-6 sui:pb-6 sui:first:pt-6',
				className,
			)}
			{...divProps}
		/>
	)
})
