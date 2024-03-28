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
		<label className="flex items-center cursor-pointer">
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
					'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer',
					'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white',
					'after:border after:rounded-full after:h-5 after:w-5',
					'after:content-[""] after:absolute after:top-[2px] after:start-[2px]',
					'after:bg-white after:border-gray-300 after:transition-all peer-checked:bg-blue-600',
				)}
			/>
		</label>
	)
}
