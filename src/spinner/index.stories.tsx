import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './index'

interface SpinnerExample {
	label: string
	displayLabel: string
	percentage?: number
}

const spinnerExamples: SpinnerExample[] = [
	{ label: 'Loading', displayLabel: 'Loading' },
	{ label: '10% complete', displayLabel: '10%', percentage: 10 },
	{ label: '25% complete', displayLabel: '25%', percentage: 25 },
	{ label: '50% complete', displayLabel: '50%', percentage: 50 },
	{ label: '75% complete', displayLabel: '75%', percentage: 75 },
	{ label: '90% complete', displayLabel: '90%', percentage: 90 },
]

const meta = {
	title: 'Components/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		label: 'Loading',
	},
	argTypes: {
		percentage: {
			control: { type: 'number', min: 0, max: 100, step: 1 },
		},
	},
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
	render: () => (
		<div
			style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', gap: 24 }}
		>
			{spinnerExamples.map(({ label, displayLabel, percentage }) => (
				<div
					key={label}
					style={{
						display: 'grid',
						justifyItems: 'center',
						gap: 8,
						minWidth: 40,
					}}
				>
					<Spinner
						label={label}
						percentage={percentage}
						className="sui:animate-spin sui:will-change-transform sui:motion-reduce:animate-none"
					/>
					<span className="sui:text-xs sui:font-medium sui:text-muted">
						{displayLabel}
					</span>
				</div>
			))}
		</div>
	),
}
