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
			className={cn('box-border px-6 pb-6 first:pt-6', className)}
			{...divProps}
		/>
	)
})
