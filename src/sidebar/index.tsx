import clsx from 'clsx'
import { ReactNode, useCallback } from 'react'
import { SidebarItem } from './sidebar-item'
import { SidebarItems } from './sidebar-items'
import { SidebarButton } from './sidebar-button'

type SidebarContainerProps = {
	isOpened?: boolean
	setIsOpened?: (toOpened: boolean) => void
	className?: string
	children: ReactNode
}

function SidebarContainer({
	children,
	isOpened,
	setIsOpened,
	className,
}: SidebarContainerProps) {
	const onClickBackdrop = useCallback(() => {
		if (!isOpened) return
		setIsOpened && setIsOpened(false)
	}, [isOpened])
	return (
		<>
			<div
				className={clsx({
					'fixed left-0 top-0 z-30 h-screen w-screen bg-primary-gary-50': isOpened,
				})}
				onClick={onClickBackdrop}
			/>
			<aside
				id="default-sidebar"
				className={clsx(
					'fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0',
					className,
					{ 'translate-x-0': isOpened },
				)}
				aria-label="Sidebar"
			>
				{children}
			</aside>
		</>
	)
}

export const Sidebar = Object.assign(SidebarContainer, {
	Item: SidebarItem,
	Items: SidebarItems,
	Button: SidebarButton,
})
