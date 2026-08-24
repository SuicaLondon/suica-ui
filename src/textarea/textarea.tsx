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
					'sui:border-control-line sui:bg-transparent sui:text-foreground sui:placeholder:text-muted sui:focus-visible:border-focus sui:focus-visible:ring-focus/20 sui:aria-invalid:border-danger sui:aria-invalid:ring-danger/20 sui:aria-[invalid=grammar]:border-danger sui:aria-[invalid=grammar]:ring-danger/20 sui:aria-[invalid=spelling]:border-danger sui:aria-[invalid=spelling]:ring-danger/20 sui:flex sui:min-h-[60px] sui:w-full sui:box-border sui:resize-y sui:rounded-control sui:border sui:px-3 sui:py-2 sui:text-base sui:shadow-sm sui:outline-none sui:disabled:cursor-not-allowed sui:disabled:opacity-50 sui:focus-visible:ring-1 sui:md:text-sm sui:font-[family-name:var(--sui-theme-font-sans)] sui:[color-scheme:var(--sui-theme-color-scheme)]',
					className,
				)}
				{...textareaProps}
			/>
		)
	},
)
