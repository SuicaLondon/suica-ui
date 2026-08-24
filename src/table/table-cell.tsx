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
			className={cn(
				'sui:box-border sui:p-2 sui:align-middle sui:[&:has([role=checkbox])]:pr-0 sui:[&>[role=checkbox]]:translate-y-[2px]',
				className,
			)}
			{...cellProps}
		/>
	)
})
