import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableBody = forwardRef<
	HTMLTableSectionElement,
	ComponentPropsWithoutRef<'tbody'>
>(function TableBody({ className, ...sectionProps }, ref) {
	return (
		<tbody
			ref={ref}
			data-slot="table-body"
			className={cn('sui:[&_tr:last-child]:border-0', className)}
			{...sectionProps}
		/>
	)
})
