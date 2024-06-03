import { HTMLAttributes } from 'react'
import { CheckboxFakeLabel } from '../..'
import FillStarIcon from './fill-star-icon'
import StarIcon from './star-icon'

export interface IStarCheckboxProps extends HTMLAttributes<HTMLInputElement> {
	leftLabel?: string
	rightLabel?: string
	checked: boolean
	className?: string
	onChecked: (checked: boolean) => void
}

export default function StarCheckbox({
	leftLabel,
	rightLabel,
	className,
	checked,
	onChecked,
}: IStarCheckboxProps) {
	return (
		<label className="w-iconSize h-iconSize flex items-center cursor-pointer peer relative border flex-center">
			<CheckboxFakeLabel label={leftLabel} />
			{leftLabel && <span className="text-sm text-primary-dark">{leftLabel}</span>}

			{checked ? (
				<>
					<FillStarIcon classNames={{ container: 'relative', icon: className }} />
					<FillStarIcon
						classNames={{
							container: 'absolute origin-center animate-scaleFadeOut',
							icon: className,
						}}
					/>
				</>
			) : (
				<StarIcon classNames={{ container: 'relative', icon: className }} />
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
