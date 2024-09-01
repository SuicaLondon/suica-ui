import type { Meta, StoryObj } from '@storybook/react'
import { HeartCheckbox } from '.'
import { useArgs } from '@storybook/preview-api'

const meta: Meta<typeof HeartCheckbox> = {
	title: 'Example/HeartCheckbox',
	component: HeartCheckbox,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		action: {
			actions: {
				argTypesRegex: '^on.*',
			},
		},
	},
	argTypes: {
		leftLabel: {
			control: 'text',
			description: 'The label that display on the left',
		},
		rightLabel: {
			control: 'text',
			description: 'The label that display on the right',
		},
		disabled: {
			control: 'boolean',
			description: 'Determines if the checkbox is checked or not',
		},
		checked: {
			control: 'boolean',
			description: 'Determines if the checkbox is checked or not',
			argTypesRegex: '.*ed$',
		},
		onChecked: {
			action: 'clicked',
			description: 'The callback function when the user check the checkbox',
			argTypesRegex: '^on.*',
		},
	},
}

export default meta
type Story = StoryObj<typeof meta>

export const HeartCheck: Story = {
	args: {
		disabled: false,
		checked: false,
	},
	render: function Render(args) {
		const [{ checked }, updateArgs] = useArgs()

		const onChecked = (newChecked: boolean) => {
			updateArgs({ checked: newChecked })
			args.onChecked(newChecked)
		}

		return (
			<HeartCheckbox
				{...args}
				checked={checked}
				onChecked={onChecked}
				classNames={{
					icon: 'fill-red-700 dark:fill-red-300',
				}}
			/>
		)
	},
}
