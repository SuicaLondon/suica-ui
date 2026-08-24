import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableHeader = forwardRef<
	HTMLTableSectionElement,
	ComponentPropsWithoutRef<'thead'>
>(function TableHeader({ className, ...sectionProps }, ref) {
	return (
		<thead
			ref={ref}
			data-slot="table-header"
			className={cn('sui:[&_tr]:border-b', className)}
			{...sectionProps}
		/>
	)
})
