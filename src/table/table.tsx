import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const Table = forwardRef<
	HTMLTableElement,
	ComponentPropsWithoutRef<'table'>
>(function Table({ className, ...tableProps }, ref) {
	return (
		<table
			ref={ref}
			data-slot="table"
			className={cn(
				'sui:w-full sui:box-border sui:caption-bottom sui:border-collapse sui:text-sm sui:text-foreground sui:font-[family-name:var(--sui-theme-font-sans)]',
				className,
			)}
			{...tableProps}
		/>
	)
})

export * from './table-body.js'
export * from './table-caption.js'
export * from './table-cell.js'
export * from './table-container.js'
export * from './table-control.js'
export * from './table-footer.js'
export * from './table-head.js'
export * from './table-header.js'
export * from './table-row.js'
