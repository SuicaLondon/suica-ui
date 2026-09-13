import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type OverlayProps = ComponentPropsWithoutRef<'div'>

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
	function Overlay({ className, ...overlayProps }, ref) {
		return (
			<div
				ref={ref}
				data-slot="overlay"
				className={cn(
					'absolute inset-0 z-10 box-border flex items-center',
					'justify-center rounded-panel bg-surface-elevated/80 p-4',
					'text-foreground backdrop-blur-overlay',
					'font-sans',
					className,
				)}
				{...overlayProps}
			/>
		)
	},
)
