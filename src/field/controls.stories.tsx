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

const fieldStyle = { display: 'grid', gap: 8 }

export const Overview: Story = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gap: 24,
				width: 384,
				maxWidth: 'calc(100vw - 32px)',
			}}
		>
			<div style={fieldStyle}>
				<Label htmlFor="controls-title">Post title</Label>
				<Input id="controls-title" placeholder="English title" />
			</div>

			<div style={fieldStyle}>
				<Label htmlFor="controls-content">Content</Label>
				<Textarea id="controls-content" placeholder="Write in Markdown…" />
			</div>

			<div style={fieldStyle}>
				<Label htmlFor="controls-status">Status</Label>
				<Select id="controls-status" defaultValue="draft">
					<option value="draft">Draft</option>
					<option value="published">Published</option>
					<option value="archived">Archived</option>
				</Select>
			</div>

			<Label
				htmlFor="controls-redirect"
				style={{ display: 'flex', alignItems: 'center', gap: 8 }}
			>
				<Checkbox id="controls-redirect" defaultChecked />
				Keep the previous URL as a redirect
			</Label>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
					gap: 12,
				}}
			>
				<Input aria-label="Disabled input" disabled value="Disabled" readOnly />
				<Input aria-label="Invalid input" aria-invalid defaultValue="Invalid" />
			</div>
		</div>
	),
}
