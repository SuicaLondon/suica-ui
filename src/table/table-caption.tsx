import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableCaption = forwardRef<
	HTMLTableCaptionElement,
	ComponentPropsWithoutRef<'caption'>
>(function TableCaption({ className, ...captionProps }, ref) {
	return (
		<caption
			ref={ref}
			data-slot="table-caption"
			className={cn('pt-4 text-start text-sm text-muted', className)}
			{...captionProps}
		/>
	)
})
