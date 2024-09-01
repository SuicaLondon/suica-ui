import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleButton } from './toggle-button'

const meta = {
	title: 'Example/ToggleButton',
	component: ToggleButton,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		label: {
			control: 'text',
			description: 'The label of the toggle button.',
		},
		checked: {
			control: 'boolean',
			description: 'Determines if the toggle button is checked or not',
			argTypesRegex: '.*ed$',
		},
		onChecked: {
			action: 'clicked',
			description: 'The callback function when the user click the toggle button',
			argTypesRegex: '^on.*',
		},
	},
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Check: Story = {
	args: {
		checked: false,
	},
	render: function Render(args) {
		const [{ checked }, updateArgs] = useArgs()

		const onChecked = (newChecked: boolean) => {
			updateArgs({ checked: newChecked })
			args.onChecked(newChecked)
		}

		return <ToggleButton {...args} checked={checked} onChecked={onChecked} />
	},
}
