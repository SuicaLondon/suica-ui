import { ReactNode } from 'react'

export interface TabProps {
	id: string
	label: ReactNode
	className?: string
}

export const AlignDirection = {
	vertical: 'vertical',
	horizontal: 'horizontal',
} as const
export type AlignDirectionKey =
	(typeof AlignDirection)[keyof typeof AlignDirection]
