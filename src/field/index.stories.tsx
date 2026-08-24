import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Field } from './index'

const meta = {
	title: 'Forms/Field',
	component: Field,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	decorators: [
		(Story) => (
			<div style={{ width: 384, maxWidth: 'calc(100vw - 32px)' }}>
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
