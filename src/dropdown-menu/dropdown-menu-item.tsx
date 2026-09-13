'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { dropdownMenuItemClassName } from './menu-item-styles.js'
import { cn } from '../cn.js'
import { useDropdownMenuContext } from './dropdown-menu-context.js'

export interface DropdownMenuItemProps extends Omit<
	ComponentPropsWithoutRef<'button'>,
	'role' | 'tabIndex' | 'type'
> {
	closeOnSelect?: boolean
	onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const DropdownMenuItem = forwardRef<
	HTMLButtonElement,
	DropdownMenuItemProps
>(function DropdownMenuItem(
	{ closeOnSelect = true, className, onClick, onSelect, ...itemProps },
	ref,
) {
	const context = useDropdownMenuContext('DropdownMenuItem')

	return (
		<button
			{...itemProps}
			ref={ref}
			type="button"
			role="menuitem"
			tabIndex={-1}
			data-slot="dropdown-menu-item"
			className={cn(
				dropdownMenuItemClassName,
				'w-full cursor-pointer appearance-none border-0',
				'bg-transparent text-start disabled:cursor-not-allowed',
				'disabled:opacity-50',
				className,
			)}
			onClick={(event) => {
				onClick?.(event)
				if (!event.defaultPrevented) onSelect?.(event)
				if (!event.defaultPrevented && closeOnSelect) {
					context.closeAndFocusTrigger()
				}
			}}
		/>
	)
})
