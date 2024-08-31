import clsx from 'clsx'
import { ReactNode, useCallback } from 'react'
import { SidebarProps } from './index.type'
import { SidebarButton } from './sidebar-button'
import { SidebarItem } from './sidebar-item'
import { SidebarItems } from './sidebar-items'

type SidebarContainerProps = SidebarProps & {
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
					'fixed top-0 left-0 z-30 w-screen h-screen bg-primary-gary-50': isOpened,
				})}
				onClick={onClickBackdrop}
			/>
			<aside
				id="default-sidebar"
				className={clsx(
					'fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0',
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
