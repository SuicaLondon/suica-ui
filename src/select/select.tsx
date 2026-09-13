import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type SelectProps = ComponentPropsWithoutRef<'select'>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	function Select({ className, ...selectProps }, ref) {
		return (
			<select
				ref={ref}
				data-slot="select"
				className={cn(
					'border-control-line bg-transparent text-foreground',
					'focus-visible:border-focus focus-visible:ring-focus/20',
					'aria-invalid:border-danger aria-invalid:ring-danger/20',
					'aria-[invalid=grammar]:border-danger',
					'aria-[invalid=grammar]:ring-danger/20',
					'aria-[invalid=spelling]:border-danger',
					'flex h-9 w-full aria-[invalid=spelling]:ring-danger/20',
					'box-border rounded-control border px-3 py-1 text-sm',
					'transition-control outline-none',
					'focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
					'font-sans',
					className,
				)}
				{...selectProps}
			/>
		)
	},
)
