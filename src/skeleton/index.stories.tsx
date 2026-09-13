import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton, type SkeletonTone } from './skeleton'

const skeletonTones: SkeletonTone[] = [
	'white',
	'accent',
	'success',
	'warning',
	'danger',
]

const skeletonToneLabel: Record<SkeletonTone, string> = {
	white: 'White',
	accent: 'Accent',
	success: 'Success',
	warning: 'Warning',
	danger: 'Danger',
}

const meta = {
	title: 'Components/Skeleton',
	component: Skeleton,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Skeleton uses a reduced-motion-aware shimmer. White is the default tone; accent and status tones reuse the corresponding theme tokens.',
			},
		},
	},
	args: {
		tone: 'white',
		className: 'h-6 w-56',
	},
	argTypes: {
		tone: {
			control: 'select',
			options: skeletonTones,
		},
	},
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
	render: () => (
		<div className="story-viewport grid w-76 gap-2.5">
			{skeletonTones.map((tone) => (
				<div key={tone} className="grid-cols-story-tones grid items-center gap-3">
					<span className="text-xs font-medium text-muted">
						{skeletonToneLabel[tone]}
					</span>
					<Skeleton tone={tone} className="h-5 w-full" />
				</div>
			))}
		</div>
	),
}

export const DashboardCard: Story = {
	render: () => (
		<div className="grid w-72 gap-3 rounded-panel border border-line p-4">
			<Skeleton tone="accent" className="h-4 w-28" />
			<Skeleton tone="accent" className="h-8 w-40" />
			<Skeleton tone="accent" className="h-20 w-full" />
		</div>
	),
}
