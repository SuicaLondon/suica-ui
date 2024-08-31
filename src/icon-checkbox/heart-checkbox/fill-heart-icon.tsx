import React, { memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type FillHeartIconProps = {
	classNames?: {
		container?: string
		icon?: string
	}
}

export const FillHeartIcon = memo(function FillHeartIcon({
	classNames,
}: FillHeartIconProps) {
	return (
		<div
			className={twMerge(
				'flex h-iconSize w-iconSize items-center justify-center',
				classNames?.container,
			)}
		>
			<Icon
				icon="heart-fill"
				className={twMerge('flex-center h-iconSize w-iconSize', classNames?.icon)}
			/>
		</div>
	)
})
