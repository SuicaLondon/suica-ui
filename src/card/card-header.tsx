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
			className={cn(
				'sui:flex sui:box-border sui:flex-col sui:gap-1.5 sui:p-6',
				className,
			)}
			{...divProps}
		/>
	)
})
