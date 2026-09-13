'use client'

import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ReactElement,
} from 'react'
import { buttonClassName } from '../button/index.js'
import { assignRef } from '../internal/assign-ref.js'
import { useDropdownMenuContext } from './dropdown-menu-context.js'

type TriggerRenderProps = ComponentPropsWithRef<'button'> & {
	'data-slot'?: string
	'data-state'?: string
}

export interface DropdownMenuTriggerProps extends Omit<
	ComponentPropsWithoutRef<'button'>,
	'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'type'
> {
	render?: (props: TriggerRenderProps) => ReactElement
}

export const DropdownMenuTrigger = forwardRef<
	HTMLButtonElement,
	DropdownMenuTriggerProps
>(function DropdownMenuTrigger(
	{ className, onClick, onKeyDown, render, ...triggerProps },
	ref,
) {
	const context = useDropdownMenuContext('DropdownMenuTrigger')

	function openWithFocus(intent: 'first' | 'last') {
		context.focusIntentRef.current = intent
		context.requestOpen(true)
	}

	const renderedProps: TriggerRenderProps = {
		...triggerProps,
		ref: (element) => {
			context.triggerRef.current = element
			assignRef(ref, element)
		},
		id: context.triggerId,
		type: 'button',
		'aria-haspopup': 'menu',
		'aria-expanded': context.open,
		'aria-controls': context.open ? context.contentId : undefined,
		'data-slot': 'dropdown-menu-trigger',
		'data-state': context.open ? 'open' : 'closed',
		className: buttonClassName({ variant: 'ghost', className: className }),
		onClick: (event) => {
			onClick?.(event)
			if (event.defaultPrevented) return
			if (!context.open) context.focusIntentRef.current = 'first'
			context.requestOpen(!context.open)
		},
		onKeyDown: (event) => {
			onKeyDown?.(event)
			if (event.defaultPrevented) return
			if (event.key === 'ArrowDown') {
				event.preventDefault()
				openWithFocus('first')
			}
			if (event.key === 'ArrowUp') {
				event.preventDefault()
				openWithFocus('last')
			}
		},
	}

	if (render) return render(renderedProps)

	return <button {...renderedProps} />
})
