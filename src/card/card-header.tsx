import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const CardHeader = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<'div'>
>(function CardHeader({ className, ...divProps }, ref) {
	return (
		<div
			ref={ref}
			data-slot="card-header"
			className={cn('box-border flex flex-col gap-1.5 p-6', className)}
			{...divProps}
		/>
	)
})
