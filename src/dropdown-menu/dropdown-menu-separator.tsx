import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type DropdownMenuSeparatorProps = Omit<
	ComponentPropsWithoutRef<'hr'>,
	'role'
>

export const DropdownMenuSeparator = forwardRef<
	HTMLHRElement,
	DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...separatorProps }, ref) {
	return (
		<hr
			{...separatorProps}
			ref={ref}
			role="separator"
			data-slot="dropdown-menu-separator"
			className={cn('my-1 border-0 border-t border-line', className)}
		/>
	)
})
