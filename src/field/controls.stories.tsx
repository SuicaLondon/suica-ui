import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../checkbox'
import { Input } from '../input'
import { Label } from '../label'
import { Select } from '../select'
import { Textarea } from '../textarea'

const meta = {
	title: 'Forms/Controls',
	component: Input,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
	render: () => (
		<div className="story-viewport grid w-96 gap-6">
			<div className="grid gap-2">
				<Label htmlFor="controls-title">Post title</Label>
				<Input id="controls-title" placeholder="English title" />
			</div>

			<div className="grid gap-2">
				<Label htmlFor="controls-content">Content</Label>
				<Textarea id="controls-content" placeholder="Write in Markdown…" />
			</div>

			<div className="grid gap-2">
				<Label htmlFor="controls-status">Status</Label>
				<Select id="controls-status" defaultValue="draft">
					<option value="draft">Draft</option>
					<option value="published">Published</option>
					<option value="archived">Archived</option>
				</Select>
			</div>

			<Label htmlFor="controls-redirect" className="flex items-center gap-2">
				<Checkbox id="controls-redirect" defaultChecked />
				Keep the previous URL as a redirect
			</Label>

			<div className="grid grid-cols-2 gap-3">
				<Input aria-label="Disabled input" disabled value="Disabled" readOnly />
				<Input aria-label="Invalid input" aria-invalid defaultValue="Invalid" />
			</div>
		</div>
	),
}
