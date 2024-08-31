import React, { memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../..'

type FillStarIconProps = {
	classNames?: {
		container?: string
		icon?: string
	}
}

export const FillStarIcon = memo(function FillStarIcon({
	classNames,
}: FillStarIconProps) {
	return (
		<div
			className={twMerge(
				'flex h-iconSize w-iconSize items-center justify-center',
				classNames?.container,
			)}
		>
			<Icon
				icon="star-fill"
				className={twMerge('flex-center h-iconSize w-iconSize', classNames?.icon)}
			/>
		</div>
	)
})
