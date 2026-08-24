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
				'sui:border-b sui:border-line sui:transition-colors sui:duration-150 sui:hover:bg-hover sui:data-[state=selected]:bg-hover sui:motion-reduce:transition-none',
				className,
			)}
			{...rowProps}
		/>
	)
})
