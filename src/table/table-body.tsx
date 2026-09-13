import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export const TableBody = forwardRef<
	HTMLTableSectionElement,
	ComponentPropsWithoutRef<'tbody'>
>(function TableBody({ className, ...sectionProps }, ref) {
	return (
		<tbody
			ref={ref}
			data-slot="table-body"
			className={className}
			{...sectionProps}
		/>
	)
})
