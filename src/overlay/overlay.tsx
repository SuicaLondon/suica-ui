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
					'sui:absolute sui:inset-0 sui:z-10 sui:flex sui:box-border sui:items-center sui:justify-center sui:rounded-panel sui:bg-surface-elevated/80 sui:p-4 sui:text-foreground sui:backdrop-blur-[1px] sui:font-[family-name:var(--sui-theme-font-sans)]',
					className,
				)}
				{...overlayProps}
			/>
		)
	},
)
