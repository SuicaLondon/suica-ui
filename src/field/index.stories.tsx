import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Field } from './index'

const meta = {
	title: 'Forms/Field',
	component: Field,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Field accepts one native-style control and wires stable ids, its label, description, error, aria-describedby, and aria-invalid. Form state and validation remain in the consumer.',
			},
		},
	},
	decorators: [
		(Story) => (
			<div className="story-viewport w-96">
				<Story />
			</div>
		),
	],
	argTypes: {
		children: { control: false },
		label: { control: 'text' },
		description: { control: 'text' },
		error: { control: 'text' },
	},
	args: {
		label: 'Post title',
		description: 'Shown as the page heading.',
		children: <Input placeholder="English title" />,
	},
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const TextInput: Story = {}

export const Invalid: Story = {
	args: {
		error: 'A title is required.',
		children: <Input defaultValue="" />,
	},
}

export const LongFormContent: Story = {
	args: {
		label: 'Content',
		description: 'Markdown is supported.',
		children: <Textarea placeholder="Write the post in Markdown…" />,
	},
}
