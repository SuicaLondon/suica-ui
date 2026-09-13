import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableCell = forwardRef<
	HTMLTableCellElement,
	ComponentPropsWithoutRef<'td'>
>(function TableCell({ className, ...cellProps }, ref) {
	return (
		<td
			ref={ref}
			data-slot="table-cell"
			className={cn('box-border p-2 align-middle', className)}
			{...cellProps}
		/>
	)
})
