import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ToggleButton } from './toggle-button'

const meta = {
	title: 'Example/ToggleButton',
	component: ToggleButton,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: { onChecked: { action: 'clicked' } },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Check: Story = {
	args: {
		checked: false,
	},
	render: function Render(args) {
		const [checked, setChecked] = useState<boolean>(args.checked)

		return <ToggleButton checked={checked} onChecked={setChecked} />
	},
}
