import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableRow = forwardRef<
	HTMLTableRowElement,
	ComponentPropsWithoutRef<'tr'>
>(function TableRow({ className, ...rowProps }, ref) {
	return (
		<tr
			ref={ref}
			data-slot="table-row"
			className={cn(
				'border-b border-line last:border-b-0',
				'hover:bg-hover data-[state=selected]:bg-hover',
				'transition-colors duration-150 motion-reduce:transition-none',
				className,
			)}
			{...rowProps}
		/>
	)
})
