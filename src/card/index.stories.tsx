import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/button'
import { Card } from './card'

const meta = {
	title: 'Components/Card',
	component: Card,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: () => (
		<Card style={{ width: 360, maxWidth: 'calc(100vw - 32px)' }}>
			<Card.Header>
				<Card.Title>Dashboard access</Card.Title>
				<Card.Description>
					Use your account to manage posts and analytics.
				</Card.Description>
			</Card.Header>
			<Card.Content>Signed in as suica@example.com</Card.Content>
			<Card.Footer>
				<Button size="sm">Continue</Button>
				<Button size="sm" variant="ghost">
					Cancel
				</Button>
			</Card.Footer>
		</Card>
	),
}
