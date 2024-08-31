import { HTMLAttributes, useMemo } from 'react'
import { CheckboxFakeLabel } from '../..'
import { FillStarIcon } from './fill-star-icon'
import { twMerge } from 'tailwind-merge'

export interface IStarCheckboxProps extends HTMLAttributes<HTMLInputElement> {
	leftLabel?: string
	rightLabel?: string
	disabled?: boolean
	checked: boolean
	classNames?: {
		container?: string
		icon?: string
	}
	onChecked: (checked: boolean) => void
}

export default function StarCheckbox({
	leftLabel,
	rightLabel,
	classNames,
	disabled,
	checked,
	onChecked,
}: IStarCheckboxProps) {
	const icon = useMemo(() => {
		if (disabled) {
			return (
				<FillStarIcon classNames={{ icon: '!fill-gray-500 !dart:fill-gray-300' }} />
			)
		}
		if (checked) {
			return (
				<div className="relative">
					<FillStarIcon classNames={{ icon: classNames?.icon }} />
					<FillStarIcon
						classNames={{
							container: 'absolute left-0 top-0 origin-center animate-scaleFadeOut',
							icon: classNames?.icon,
						}}
					/>
				</div>
			)
		}
		return <FillStarIcon classNames={{ icon: classNames?.icon }} />
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
				checked={checked}
				onChange={() => onChecked(!checked)}
				className={'sr-only peer'}
			/>
			<CheckboxFakeLabel label={rightLabel} />
		</label>
	)
}
