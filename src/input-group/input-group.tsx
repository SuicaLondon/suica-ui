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
					'sui:border-control-line sui:bg-surface sui:text-foreground sui:focus-within:border-focus sui:focus-within:ring-focus/20 sui:has-[input[aria-invalid=true]]:border-danger sui:has-[input[aria-invalid=true]]:ring-danger/20 sui:has-[input[aria-invalid=grammar]]:border-danger sui:has-[input[aria-invalid=grammar]]:ring-danger/20 sui:has-[input[aria-invalid=spelling]]:border-danger sui:has-[input[aria-invalid=spelling]]:ring-danger/20 sui:flex sui:min-h-9 sui:w-full sui:box-border sui:items-stretch sui:overflow-hidden sui:rounded-control sui:border sui:shadow-sm sui:transition-[border-color,box-shadow] sui:has-[:disabled]:cursor-not-allowed sui:has-[:disabled]:opacity-50 sui:focus-within:ring-1 sui:has-[input[aria-invalid=true]]:ring-1 sui:has-[input[aria-invalid=grammar]]:ring-1 sui:has-[input[aria-invalid=spelling]]:ring-1 sui:[&_[data-slot=input]]:h-auto sui:[&_[data-slot=input]]:min-w-0 sui:[&_[data-slot=input]]:flex-1 sui:[&_[data-slot=input]]:rounded-none sui:[&_[data-slot=input]]:border-0 sui:[&_[data-slot=input]]:bg-transparent sui:[&_[data-slot=input]]:pl-0 sui:[&_[data-slot=input]]:shadow-none sui:[&_[data-slot=input]]:disabled:opacity-100 sui:[&_[data-slot=input]]:focus-visible:border-transparent sui:[&_[data-slot=input]]:focus-visible:ring-0 sui:font-[family-name:var(--sui-theme-font-sans)]',
					className,
				)}
				{...groupProps}
			/>
		)
	},
)

export { InputGroupAddon } from './input-group-addon.js'
export type { InputGroupAddonProps } from './input-group-addon.js'
