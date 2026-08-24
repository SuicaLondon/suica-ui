import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const CardContent = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<'div'>
>(function CardContent({ className, ...divProps }, ref) {
	return (
		<div
			ref={ref}
			data-slot="card-content"
			className={cn('sui:box-border sui:px-6 sui:pb-6 sui:first:pt-6', className)}
			{...divProps}
		/>
	)
})
