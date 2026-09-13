'use client'

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
				'z-50 m-0 box-border inline-grid size-11 cursor-pointer',
				'touch-manipulation appearance-none place-items-center',
				'rounded-control border border-line-strong bg-surface p-0',
				'text-icon',
				'transition-tab-colors duration-150',
				'ease-natural hover:border-accent hover:bg-hover hover:text-accent',
				'focus-visible:outline-2 focus-visible:outline-focus',
				'focus-visible:outline-offset-2 motion-reduce:transition-none',
				'font-inherit',
				{
					'fixed start-4 top-4': fixed,
					relative: !fixed,
				},
				className,
			)}
			onClick={() => onOpenChange(!open)}
		>
			<SidebarTriggerIcon state={state} />
		</button>
	)
})
