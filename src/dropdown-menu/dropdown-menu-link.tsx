'use client'

import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ReactElement,
} from 'react'
import { dropdownMenuItemClassName } from './menu-item-styles.js'
import { cn } from '../cn.js'
import { useDropdownMenuContext } from './dropdown-menu-context.js'

export type DropdownMenuLinkRenderProps = ComponentPropsWithRef<'a'> & {
	'data-slot'?: string
}

export interface DropdownMenuLinkProps extends Omit<
	ComponentPropsWithoutRef<'a'>,
	'role' | 'tabIndex'
> {
	render?: (props: DropdownMenuLinkRenderProps) => ReactElement
	closeOnSelect?: boolean
	disabled?: boolean
	onSelect?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

export const DropdownMenuLink = forwardRef<
	HTMLAnchorElement,
	DropdownMenuLinkProps
>(function DropdownMenuLink(
	{
		closeOnSelect = true,
		disabled = false,
		className,
		onClick,
		onSelect,
		render,
		...linkProps
	},
	ref,
) {
	const context = useDropdownMenuContext('DropdownMenuLink')

	const renderedProps: DropdownMenuLinkRenderProps = {
		...linkProps,
		ref,
		role: 'menuitem',
		'aria-disabled': disabled || undefined,
		tabIndex: -1,
		'data-slot': 'dropdown-menu-item',
		className: cn(
			dropdownMenuItemClassName,
			'no-underline aria-disabled:pointer-events-none',
			'aria-disabled:opacity-50',
			className,
		),
		onClick: (event) => {
			onClick?.(event)
			if (disabled) {
				event.preventDefault()
				return
			}
			if (!event.defaultPrevented) onSelect?.(event)
			if (!event.defaultPrevented && closeOnSelect) {
				context.closeAndFocusTrigger()
			}
		},
	}

	if (render) return render(renderedProps)
	return <a {...renderedProps} />
})
