import { useDayPicker, type DropdownProps } from 'react-day-picker'
import { Select } from '../select/index.js'
import { cn } from '../cn.js'

/** @internal */
export function YearDropdown({ options, className, ...props }: DropdownProps) {
	const { components, classNames } = useDayPicker()
	const { Option } = components
	return (
		<Select
			{...props}
			className={cn('w-20 px-2', classNames.dropdown, className)}
		>
			{options?.map(({ value, label, disabled }) => (
				<Option key={value} value={value} disabled={disabled}>
					{label}
				</Option>
			))}
		</Select>
	)
}
