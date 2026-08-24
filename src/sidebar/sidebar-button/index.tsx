import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../cn.js'
import { getSidebarState } from '../sidebar-state.js'
import { SidebarTriggerIcon } from './sidebar-trigger-icon.js'

export interface SidebarTriggerProps extends Omit<
	ComponentPropsWithoutRef<'button'>,
	'aria-controls' | 'aria-expanded' | 'aria-label' | 'onClick' | 'type'
> {
	open: boolean
	onOpenChange: (open: boolean) => void
	label: string
	controls?: string
	fixed?: boolean
}

export const SidebarTrigger = forwardRef<
	HTMLButtonElement,
	SidebarTriggerProps
>(function SidebarTrigger(
	{
		open,
		onOpenChange,
		label,
		controls = 'suica-sidebar',
		fixed = false,
		className,
		...props
	},
	ref,
) {
	const state = getSidebarState(open)

	return (
		<button
			{...props}
			ref={ref}
			type="button"
			aria-label={label}
			aria-controls={controls}
			aria-expanded={open}
			data-slot="sidebar-trigger"
			data-state={state}
			className={cn(
				'sui:z-50 sui:m-0 sui:inline-grid sui:size-11 sui:box-border sui:cursor-pointer sui:touch-manipulation sui:appearance-none sui:place-items-center sui:rounded-control sui:border sui:border-line-strong sui:bg-surface sui:p-0 sui:text-[var(--sui-theme-icon)] sui:transition-[border-color,background-color,color] sui:duration-150 sui:ease-[ease] sui:hover:border-accent sui:hover:bg-hover sui:hover:text-accent sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-2 sui:motion-reduce:transition-none sui:[font:inherit]',
				{
					'sui:fixed sui:start-4 sui:top-4': fixed,
					'sui:relative': !fixed,
				},
				className,
			)}
			onClick={() => onOpenChange(!open)}
		>
			<SidebarTriggerIcon state={state} />
		</button>
	)
})
