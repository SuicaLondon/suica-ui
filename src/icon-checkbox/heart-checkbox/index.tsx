import { HTMLAttributes } from 'react'
import { CheckboxFakeLabel } from '../..'
import FillHeartIcon from './fill-heart-icon'
import HeartIcon from './heart-icon'
import { twMerge } from 'tailwind-merge'

export interface IHeartCheckboxProps extends HTMLAttributes<HTMLInputElement> {
	leftLabel?: string
	rightLabel?: string
	checked: boolean
	className?: string
	onChecked: (checked: boolean) => void
}

export default function HeartCheckbox({
	leftLabel,
	rightLabel,
	className,
	checked,
	onChecked,
}: IHeartCheckboxProps) {
	return (
		<label className="w-iconSize h-iconSize flex items-center cursor-pointer peer relative border flex-center">
			<CheckboxFakeLabel label={leftLabel} />
			{leftLabel && <span className="text-sm text-primary-dark">{leftLabel}</span>}

			{checked ? (
				<>
					<FillHeartIcon classNames={{ container: 'relative', icon: className }} />
					<FillHeartIcon
						classNames={{
							container: 'absolute origin-center animate-scaleFadeOut',
							icon: className,
						}}
					/>
				</>
			) : (
				<HeartIcon classNames={{ container: 'relative', icon: className }} />
			)}
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
