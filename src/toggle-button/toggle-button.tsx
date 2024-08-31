import clsx from 'clsx'
import { HTMLAttributes } from 'react'
import { CheckboxFakeLabel } from '..'

export interface IToggleButtonProps extends HTMLAttributes<HTMLInputElement> {
	label?: string
	checked: boolean
	onChecked: (checked: boolean) => void
}

export function ToggleButton({
	label,
	checked,
	onChecked,
}: IToggleButtonProps) {
	return (
		<label className="flex items-center cursor-pointer peer">
			<CheckboxFakeLabel label={label} />
			<input
				type="checkbox"
				checked={checked}
				onChange={() => onChecked(!checked)}
				className={clsx('sr-only peer')}
			/>
			<div
				className={clsx(
					'relative w-14 h-6 bg-gray-200 rounded-full flex items-center',
					'after:border after:rounded-full after:h-5 after:w-5',
					'after:content-[""] after:absolute after:top-[2px] after:start-[2px]',
					'after:bg-primary-gray after:border-gray-300 after:transition-all',
					'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300',
					'peer-checked:after:translate-x-8', // Should be width - height
					'peer-checked:bg-primary-gray peer-checked:after:bg-white peer-checked:after:border-white',
					{
						'justify-start text-white': checked,
						'justify-end text-primary-gray': !checked,
					},
				)}
			>
				<p className="px-2 text-sm">{checked ? 'On' : 'Off'}</p>
			</div>
		</label>
	)
}
