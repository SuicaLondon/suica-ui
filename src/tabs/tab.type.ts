import type { ReactNode } from 'react'

export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivationMode = 'automatic' | 'manual'
export type TabsVariant = 'underline' | 'segmented'

export interface TabItem {
	id: string
	label: ReactNode
	panel?: ReactNode
	disabled?: boolean
	className?: string
	panelClassName?: string
}
