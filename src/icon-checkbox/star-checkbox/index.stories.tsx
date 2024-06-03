import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import StarCheckbox from '.'

const meta = {
	title: 'Example/StarCheckbox',
	component: StarCheckbox,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	argTypes: { onChecked: { action: 'clicked' } },
} satisfies Meta<typeof StarCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const StarCheck: Story = {
	args: {
		checked: false,
	},
	render: function Render(args) {
		const [checked, setChecked] = useState<boolean>(args.checked)
		return (
			<StarCheckbox
				{...args}
				checked={checked}
				onChecked={setChecked}
				className="fill-yellow-700 dark:fill-yellow-300"
			/>
		)
	},
}
