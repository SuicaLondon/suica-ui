import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<'div'>

export const DropdownMenuLabel = forwardRef<
	HTMLDivElement,
	DropdownMenuLabelProps
>(function DropdownMenuLabel({ className, ...labelProps }, ref) {
	return (
		<div
			{...labelProps}
			ref={ref}
			role="presentation"
			data-slot="dropdown-menu-label"
			className={cn('px-3 py-2 text-xs font-medium text-muted', className)}
		/>
	)
})
