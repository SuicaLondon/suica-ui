import cn from 'classnames'
import { HTMLAttributes } from 'react'

export interface ISliderCheckboxProps extends HTMLAttributes<HTMLInputElement> {
	label: string
	checked: boolean
	onChecked: (checked: boolean) => void
}

export function ToggleButton({
	label,
	checked,
	onChecked,
}: ISliderCheckboxProps) {
	return (
		<label className="flex items-center cursor-pointer peer">
			<span className="text-sm text-primary-dark">{label}</span>
			<input
				type="checkbox"
				checked={checked}
				onChange={() => onChecked(!checked)}
				className={cn('sr-only peer')}
			/>
			<div
				className={cn(
					'relative w-11 h-6 bg-gray-200 rounded-full',
					'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300',
					'peer-checked:after:translate-x-full peer-checked:after:border-white',
					'peer-checked:bg-primary-dart peer-checked:after:bg-white',
					'after:border after:rounded-full after:h-5 after:w-5',
					'after:content-[""] after:absolute after:top-[2px] after:start-[2px]',
					'after:bg-primary-dart after:border-gray-300 after:transition-all',
				)}
			/>
		</label>
	)
}
