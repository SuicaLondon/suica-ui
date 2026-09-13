import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionHeading } from './section-heading'

const meta = {
	title: 'Components/SectionHeading',
	component: SectionHeading,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	decorators: [
		(Story) => (
			<div className="story-viewport w-180">
				<Story />
			</div>
		),
	],
	args: {
		eyebrow: 'Audience',
		title: 'Location and language',
		titleId: 'viewer-location-title',
		description:
			'See where matching viewers come from and which locale they use.',
	},
} satisfies Meta<typeof SectionHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
