'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { useDialogContext } from './dialog-context.js'

export const DialogTitle = forwardRef<
	HTMLHeadingElement,
	ComponentPropsWithoutRef<'h2'>
>(function DialogTitle({ className, ...props }, ref) {
	const context = useDialogContext('DialogTitle')
	return (
		<h2
			{...props}
			ref={ref}
			id={context.titleId}
			data-slot="dialog-title"
			className={cn('m-0 text-xl font-semibold', className)}
		/>
	)
})
