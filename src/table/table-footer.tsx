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
			className={cn(
				'sui:border-t sui:border-line sui:bg-hover sui:font-medium sui:[&>tr]:last:border-b-0',
				className,
			)}
			{...sectionProps}
		/>
	)
})
