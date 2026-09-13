import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { zhTW } from 'react-day-picker/locale'
import { DatePicker } from './index'

const referenceDate = new Date(2026, 8, 13)
const meta = {
	title: 'Components/DatePicker',
	component: DatePicker,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		today: referenceDate,
		defaultMonth: referenceDate,
		'aria-label': 'Choose a date',
		className: 'w-75',
	},
} satisfies Meta<typeof DatePicker>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
	render: function ControlledDatePicker(args) {
		const [date, setDate] = useState<Date | undefined>(referenceDate)
		return (
			<DatePicker
				{...args}
				selected={date}
				onSelect={setDate}
				footer={
					date ? `Selected: ${date.toLocaleDateString('en-US')}` : 'Choose a date.'
				}
			/>
		)
	},
}

export const Localized: Story = { args: { locale: zhTW } }
export const RestrictedDates: Story = {
	args: {
		startMonth: referenceDate,
		endMonth: new Date(2026, 11),
		disabled: { before: referenceDate },
	},
}
