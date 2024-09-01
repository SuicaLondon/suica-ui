import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import StarCheckbox from '.'

const meta = {
	title: 'Example/StarCheckbox',
	component: StarCheckbox,
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
} satisfies Meta<typeof StarCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const StarCheck: Story = {
	args: {
		checked: false,
		onChecked: () => {},
	},
	render: function Render(args) {
		const [{ checked }, updateArgs] = useArgs()

		const onChecked = (newChecked: boolean) => {
			updateArgs({ checked: newChecked })
			args.onChecked(newChecked)
		}

		return (
			<StarCheckbox
				{...args}
				checked={checked}
				onChecked={onChecked}
				classNames={{
					icon: 'fill-yellow-700 dark:fill-yellow-300',
				}}
			/>
		)
	},
}
