import React from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type FillStarIconProps = {
	classNames: {
		container?: string
		icon?: string
	}
}

export default function FillStarIcon({ classNames }: FillStarIconProps) {
	return (
		<div
			className={twMerge(
				'w-iconSize h-iconSize flex justify-center items-center',
				classNames.container,
			)}
		>
			<Icon
				icon="star-fill"
				className={twMerge('w-iconSize h-iconSize flex-center', classNames.icon)}
			/>
		</div>
	)
}
