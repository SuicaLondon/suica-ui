'use client'

import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ReactElement,
} from 'react'
import { buttonClassName } from '../button/index.js'
import { useDialogContext } from './dialog-context.js'

type CloseRenderProps = ComponentPropsWithRef<'button'> & {
	'data-slot'?: string
}

export interface DialogCloseProps extends Omit<
	ComponentPropsWithoutRef<'button'>,
	'type'
> {
	render?: (props: CloseRenderProps) => ReactElement
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
	function DialogClose(
		{ className, disabled, onClick, render, ...closeProps },
		ref,
	) {
		const context = useDialogContext('DialogClose')
		const renderedProps: CloseRenderProps = {
			...closeProps,
			ref,
			type: 'button',
			disabled: disabled || !context.dismissible,
			'data-slot': 'dialog-close',
			className: buttonClassName({ variant: 'outline', className: className }),
			onClick: (event) => {
				onClick?.(event)
				if (!event.defaultPrevented) context.requestOpen(false)
			},
		}
		if (render) return render(renderedProps)
		return <button {...renderedProps} />
	},
)
