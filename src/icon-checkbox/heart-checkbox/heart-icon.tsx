import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type HeartIconProps = {
	classNames: {
		container?: string
		icon?: string
	}
}

export default function HeartIcon({ classNames }: HeartIconProps) {
	return (
		<div
			className={twMerge(
				'w-iconSize h-iconSize flex-center',
				classNames.container,
			)}
		>
			<Icon
				icon="heart"
				className={twMerge('w-iconSize h-iconSize flex-center', classNames.icon)}
			/>
		</div>
	)
}
