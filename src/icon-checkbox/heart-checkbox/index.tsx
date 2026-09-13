import { forwardRef } from 'react'
import { Icon } from '../../icons/index.js'
import { IconCheckbox, type IconCheckboxProps } from '../icon-checkbox.js'

export type HeartCheckboxProps = Omit<
	IconCheckboxProps,
	'checkedIcon' | 'uncheckedIcon'
>

export const HeartCheckbox = forwardRef<HTMLInputElement, HeartCheckboxProps>(
	function HeartCheckbox(props, ref) {
		return (
			<IconCheckbox
				ref={ref}
				uncheckedIcon={<Icon icon="heart" className="size-full" />}
				checkedIcon={<Icon icon="heart-fill" className="size-full" />}
				{...props}
			/>
		)
	},
)
