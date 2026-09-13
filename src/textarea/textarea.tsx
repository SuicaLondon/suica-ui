import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea({ className, ...textareaProps }, ref) {
		return (
			<textarea
				ref={ref}
				data-slot="textarea"
				className={cn(
					'border-control-line bg-transparent text-foreground',
					'placeholder:text-muted focus-visible:border-focus',
					'focus-visible:ring-focus/20 aria-invalid:border-danger',
					'aria-invalid:ring-danger/20 aria-[invalid=grammar]:border-danger',
					'aria-[invalid=grammar]:ring-danger/20',
					'aria-[invalid=spelling]:border-danger',
					'flex min-h-15 w-full aria-[invalid=spelling]:ring-danger/20',
					'box-border resize-y rounded-control border px-3 py-2',
					'text-base outline-none disabled:cursor-not-allowed',
					'focus-visible:ring-1 disabled:opacity-50 md:text-sm',
					'font-sans',
					className,
				)}
				{...textareaProps}
			/>
		)
	},
)
