import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type InputGroupProps = ComponentPropsWithoutRef<'div'>

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
	function InputGroup({ className, ...groupProps }, ref) {
		return (
			<div
				ref={ref}
				data-slot="input-group"
				className={cn(
					'border-control-line bg-surface text-foreground',
					'focus-within:border-focus focus-within:ring-focus/20',
					'has-[input[aria-invalid=true]]:border-danger',
					'has-[input[aria-invalid=true]]:ring-danger/20',
					'has-[input[aria-invalid=grammar]]:border-danger',
					'has-[input[aria-invalid=grammar]]:ring-danger/20',
					'has-[input[aria-invalid=spelling]]:border-danger',
					'flex min-h-9 has-[input[aria-invalid=spelling]]:ring-danger/20',
					'box-border w-full items-stretch overflow-hidden',
					'rounded-control border transition-control',
					'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
					'focus-within:ring-1 has-[input[aria-invalid=true]]:ring-1',
					'has-[input[aria-invalid=grammar]]:ring-1',
					'input-group-control has-[input[aria-invalid=spelling]]:ring-1',
					'font-sans',
					className,
				)}
				{...groupProps}
			/>
		)
	},
)

export { InputGroupAddon } from './input-group-addon.js'
export type { InputGroupAddonProps } from './input-group-addon.js'
