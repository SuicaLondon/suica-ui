'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { useDialogContext } from './dialog-context.js'

export const DialogDescription = forwardRef<
	HTMLParagraphElement,
	ComponentPropsWithoutRef<'p'>
>(function DialogDescription({ className, ...props }, ref) {
	const context = useDialogContext('DialogDescription')
	return (
		<p
			{...props}
			ref={ref}
			id={context.descriptionId}
			data-slot="dialog-description"
			className={cn('mt-3 text-muted', className)}
		/>
	)
})
