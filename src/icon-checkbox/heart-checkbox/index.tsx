import { HTMLAttributes, memo, useMemo } from 'react'
import { CheckboxFakeLabel } from '../..'
import { FillHeartIcon } from './fill-heart-icon'
import { HeartIcon } from './heart-icon'
import { twMerge } from 'tailwind-merge'

export interface IHeartCheckboxProps extends HTMLAttributes<HTMLInputElement> {
	leftLabel?: string
	rightLabel?: string
	checked: boolean
	disabled?: boolean
	classNames?: {
		container?: string
		icon?: string
	}
	onChecked: (checked: boolean) => void
}

export const HeartCheckbox = memo(function HeartCheckbox({
	leftLabel,
	rightLabel,
	classNames,
	disabled = false,
	checked,
	onChecked,
}: IHeartCheckboxProps) {
	const icon = useMemo(() => {
		if (disabled) {
			return (
				<FillHeartIcon
					classNames={{ icon: '!fill-gray-500 !dart:fill-gray-300' }}
				/>
			)
		}
		if (checked) {
			return (
				<div className="relative">
					<FillHeartIcon classNames={{ icon: classNames?.icon }} />
					<FillHeartIcon
						classNames={{
							container: 'absolute left-0 top-0 origin-center animate-scaleFadeOut',
							icon: classNames?.icon,
						}}
					/>
				</div>
			)
		}
		return (
			<HeartIcon classNames={{ container: 'relative', icon: classNames?.icon }} />
		)
	}, [disabled, checked])
	return (
		<label
			className={twMerge(
				'h-iconSize flex items-center cursor-pointer peer relative border flex-center',
				classNames?.container,
			)}
		>
			<CheckboxFakeLabel label={leftLabel} />

			{icon}
			<input
				type="checkbox"
				disabled={disabled}
				checked={checked}
				onChange={() => onChecked(!checked)}
				className={'sr-only peer'}
			/>
			<CheckboxFakeLabel label={rightLabel} />
		</label>
	)
})
