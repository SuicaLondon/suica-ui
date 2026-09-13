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
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Spinner is indeterminate when percentage is omitted and determinate from 0 to 100 when provided. Values are clamped, and the required label supplies its accessible name.',
			},
		},
	},
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
		<div className="flex flex-wrap items-start gap-6">
			{spinnerExamples.map(({ label, displayLabel, percentage }) => (
				<div key={label} className="grid min-w-10 justify-items-center gap-2">
					<Spinner
						label={label}
						percentage={percentage}
						className={
							'animate-spin will-change-transform motion-reduce:animate-none'
						}
					/>
					<span className="text-xs font-medium text-muted">{displayLabel}</span>
				</div>
			))}
		</div>
	),
}
