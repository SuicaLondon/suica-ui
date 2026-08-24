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
				'sui:h-10 sui:box-border sui:px-2 sui:text-left sui:align-middle sui:font-medium sui:text-muted sui:[&:has([role=checkbox])]:pr-0 sui:[&>[role=checkbox]]:translate-y-[2px]',
				className,
			)}
			{...headProps}
		/>
	)
})
