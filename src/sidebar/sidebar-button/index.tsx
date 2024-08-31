import clsx from 'clsx'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

export type SidebarButtonProps = {
	isHovered?: boolean
	isOpened: boolean
	setIsOpened: (toOpened: boolean) => void
	className?: string
}

export const SidebarButton = memo(function SidebarButton({
	isHovered = true,
	isOpened,
	setIsOpened,
	className,
}: SidebarButtonProps) {
	return (
		<button
			aria-controls="default-sidebar"
			type="button"
			className={twMerge(
				clsx(
					'h-6 w-6 translate-x-0 cursor-pointer',
					'flex flex-col items-center justify-center',
					{ 'phone:left-2 phone:top-2 fixed left-4 top-4 z-999': isHovered },
				),
				className,
			)}
			onClick={() => setIsOpened && setIsOpened(!isOpened)}
		>
			<span className="sr-only">Open sidebar</span>
			<span
				className={twMerge(
					'block h-[2px] w-6 origin-center rounded bg-primary-gray transition-all',
					clsx({
						'-mb-[1px] w-[calc(16px_/_sin(45deg))] rotate-45 bg-primary-gray':
							isOpened,
					}),
				)}
			></span>
			<span
				className={twMerge(
					'my-2 block h-[2px] w-6 origin-center rounded bg-primary-gray transition-all',
					clsx({
						'my-0 hidden w-[calc(16px_/_sin(45deg))] bg-primary-gray': isOpened,
					}),
				)}
			></span>
			<span
				className={twMerge(
					'block h-[2px] w-6 origin-center rounded bg-primary-gray transition-all',
					clsx({
						'-mt-[1px] w-[calc(16px_/_sin(45deg))] -rotate-45 bg-primary-gray':
							isOpened,
					}),
				)}
			></span>
		</button>
	)
})
