import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableFooter = forwardRef<
	HTMLTableSectionElement,
	ComponentPropsWithoutRef<'tfoot'>
>(function TableFooter({ className, ...sectionProps }, ref) {
	return (
		<tfoot
			ref={ref}
			data-slot="table-footer"
			className={cn('border-t border-line bg-hover font-medium', className)}
			{...sectionProps}
		/>
	)
})
