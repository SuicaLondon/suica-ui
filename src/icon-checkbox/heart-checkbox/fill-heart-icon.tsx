import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type FillHeartIconProps = {
	classNames: {
		container?: string
		icon?: string
	}
}

export default function FillHeartIcon({ classNames }: FillHeartIconProps) {
	return (
		<div
			className={twMerge(
				'w-iconSize h-iconSize flex justify-center items-center',
				classNames.container,
			)}
		>
			<Icon
				icon="heart-fill"
				className={twMerge('w-iconSize h-iconSize flex-center', classNames.icon)}
			/>
		</div>
	)
}
