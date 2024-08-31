import React, { memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type StarIconProps = {
	classNames: {
		container?: string
		icon?: string
	}
}

export const StarIcon = memo(function StarIcon({ classNames }: StarIconProps) {
	return (
		<div
			className={twMerge(
				'w-iconSize h-iconSize flex-center',
				classNames.container,
			)}
		>
			<Icon
				icon="star"
				className={twMerge('w-iconSize h-iconSize flex-center', classNames.icon)}
			/>
		</div>
	)
})
