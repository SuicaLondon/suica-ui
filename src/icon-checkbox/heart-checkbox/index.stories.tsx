import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import HeartCheckbox from '.'

const meta = {
	title: 'Example/HeartCheckbox',
	component: HeartCheckbox,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	argTypes: { onChecked: { action: 'clicked' } },
} satisfies Meta<typeof HeartCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const HeartCheck: Story = {
	args: {
		checked: false,
	},
	render: function Render(args) {
		const [checked, setChecked] = useState<boolean>(args.checked)
		return (
			<HeartCheckbox
				{...args}
				checked={checked}
				onChecked={setChecked}
				className="fill-red-700 dark:fill-red-300"
			/>
		)
	},
}
