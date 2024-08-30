import React from 'react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

type SidebarButtonProps = {
	isOpened: boolean
	setIsOpened: (toOpened: boolean) => void
}

export function SidebarButton({ isOpened, setIsOpened }: SidebarButtonProps) {
	return (
		<button
			aria-controls="default-sidebar"
			type="button"
			className={clsx(
				'cursor-pointer w-6 h-6 translate-x-0',
				'fixed phone:left-2 phone:top-2 left-4 top-4 z-999',
				'flex flex-col justify-center items-center',
			)}
			onClick={() => setIsOpened(!isOpened)}
		>
			<span className="sr-only">Open sidebar</span>
			<span
				className={twMerge(
					'block w-6 h-[2px] rounded bg-primary-gray transition-all origin-center',
					clsx({
						' w-[calc(16px_/_sin(45deg))] bg-primary-gray rotate-45 -mb-[1px]':
							isOpened,
					}),
				)}
			></span>
			<span
				className={twMerge(
					'block w-6 h-[2px] rounded bg-primary-gray transition-all origin-center my-2',
					clsx({
						'w-[calc(16px_/_sin(45deg))] bg-primary-gray hidden my-0': isOpened,
					}),
				)}
			></span>
			<span
				className={twMerge(
					'block w-6 h-[2px] rounded bg-primary-gray transition-all origin-center',
					clsx({
						'w-[calc(16px_/_sin(45deg))] bg-primary-gray -rotate-45 -mt-[1px]':
							isOpened,
					}),
				)}
			></span>
		</button>
	)
}
