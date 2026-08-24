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
	parameters: { layout: 'centered' },
	args: {
		tone: 'white',
		style: { height: 24, width: 224 },
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
		<div
			style={{
				display: 'grid',
				gap: 10,
				width: 304,
				maxWidth: 'calc(100vw - 32px)',
			}}
		>
			{skeletonTones.map((tone) => (
				<div
					key={tone}
					style={{
						display: 'grid',
						gridTemplateColumns: '64px minmax(0, 1fr)',
						alignItems: 'center',
						gap: 12,
					}}
				>
					<span className="sui:text-xs sui:font-medium sui:text-muted">
						{skeletonToneLabel[tone]}
					</span>
					<Skeleton tone={tone} style={{ height: 20, width: '100%' }} />
				</div>
			))}
		</div>
	),
}

export const DashboardCard: Story = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gap: 12,
				width: 288,
				border: '1px solid var(--sui-theme-line)',
				borderRadius: 12,
				padding: 16,
			}}
		>
			<Skeleton tone="accent" style={{ height: 16, width: 112 }} />
			<Skeleton tone="accent" style={{ height: 32, width: 160 }} />
			<Skeleton tone="accent" style={{ height: 80, width: '100%' }} />
		</div>
	),
}
