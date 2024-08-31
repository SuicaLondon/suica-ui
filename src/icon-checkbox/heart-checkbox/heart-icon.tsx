import React, { memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type HeartIconProps = {
	classNames?: {
		container?: string
		icon?: string
	}
}

export const HeartIcon = memo(function HeartIcon({
	classNames,
}: HeartIconProps) {
	return (
		<div
			className={twMerge(
				'flex-center h-iconSize w-iconSize',
				classNames?.container,
			)}
		>
			<Icon
				icon="heart"
				className={twMerge('flex-center h-iconSize w-iconSize', classNames?.icon)}
			/>
		</div>
	)
})
