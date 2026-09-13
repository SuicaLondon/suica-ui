'use client'

import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ReactElement,
} from 'react'
import { buttonClassName } from '../button/index.js'
import { assignRef } from '../internal/assign-ref.js'
import { useDialogContext } from './dialog-context.js'

type TriggerRenderProps = ComponentPropsWithRef<'button'> & {
	'data-slot'?: string
}

export interface DialogTriggerProps extends Omit<
	ComponentPropsWithoutRef<'button'>,
	'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'type'
> {
	render?: (props: TriggerRenderProps) => ReactElement
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
	function DialogTrigger({ className, onClick, render, ...triggerProps }, ref) {
		const context = useDialogContext('DialogTrigger')
		const renderedProps: TriggerRenderProps = {
			...triggerProps,
			ref: (element) => {
				context.triggerRef.current = element
				assignRef(ref, element)
			},
			type: 'button',
			'aria-haspopup': 'dialog',
			'aria-expanded': context.open,
			'aria-controls': context.open ? context.contentId : undefined,
			'data-slot': 'dialog-trigger',
			className: buttonClassName({ className: className }),
			onClick: (event) => {
				onClick?.(event)
				if (!event.defaultPrevented) context.requestOpen(true)
			},
		}
		if (render) return render(renderedProps)
		return <button {...renderedProps} />
	},
)
