import { forwardRef } from 'react'
import { Icon } from '../../icons/index.js'
import { IconCheckbox, type IconCheckboxProps } from '../icon-checkbox.js'

export type StarCheckboxProps = Omit<
	IconCheckboxProps,
	'checkedIcon' | 'uncheckedIcon'
>

export const StarCheckbox = forwardRef<HTMLInputElement, StarCheckboxProps>(
	function StarCheckbox(props, ref) {
		return (
			<IconCheckbox
				ref={ref}
				uncheckedIcon={<Icon icon="star" className="sui:size-full" />}
				checkedIcon={<Icon icon="star-fill" className="sui:size-full" />}
				{...props}
			/>
		)
	},
)
