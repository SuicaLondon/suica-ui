import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const TableHead = forwardRef<
	HTMLTableCellElement,
	ComponentPropsWithoutRef<'th'>
>(function TableHead({ className, scope = 'col', ...headProps }, ref) {
	return (
		<th
			ref={ref}
			data-slot="table-head"
			scope={scope}
			className={cn(
				'box-border h-10 px-2 text-start align-middle font-medium text-muted',
				className,
			)}
			{...headProps}
		/>
	)
})
