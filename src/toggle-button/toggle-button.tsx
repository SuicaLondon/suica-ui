import clsx from 'clsx'
import { HTMLAttributes, memo } from 'react'
import { CheckboxFakeLabel } from '..'

export interface IToggleButtonProps extends HTMLAttributes<HTMLInputElement> {
	label?: string
	checked: boolean
	onChecked: (checked: boolean) => void
}

export const ToggleButton = memo(function ToggleButton({
	label,
	checked,
	onChecked,
}: IToggleButtonProps) {
	return (
		<label className="peer flex cursor-pointer items-center">
			<CheckboxFakeLabel label={label} />
			<input
				type="checkbox"
				checked={checked}
				onChange={() => onChecked(!checked)}
				className={clsx('peer sr-only')}
			/>
			<div
				className={clsx(
					'relative flex h-6 w-14 items-center rounded-full bg-gray-200',
					'after:h-5 after:w-5 after:rounded-full after:border',
					'after:absolute after:start-[2px] after:top-[2px] after:content-[""]',
					'after:border-gray-300 after:bg-primary-gray after:transition-all',
					'peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300',
					'peer-checked:after:translate-x-8', // Should be width - height
					'peer-checked:bg-primary-gray peer-checked:after:border-white peer-checked:after:bg-white',
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
})
