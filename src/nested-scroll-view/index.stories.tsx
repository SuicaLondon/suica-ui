import type { Meta, StoryObj } from '@storybook/react'
import { NestedScrollView } from './nested-scroll-view'

const meta = {
	title: 'Example/NestedScrollView',
	component: NestedScrollView,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		scrollableDistance: {
			control: {
				type: 'number',
				min: 0,
				max: 'The height of the header',
			},
			description: 'Determines the scrollable distance of the scroll view',
		},
		minDistanceToTop: {
			control: {
				type: 'number',
				min: 0,
				max: 'The height of the header',
			},
			description:
				'Specifies the minimum distance from the top border of the component to the top of the scrollable view, determining how much of the header remains visible to the user.',
		},
		extraHeight: {
			control: {
				type: 'number',
				min: 0,
			},
			description:
				'The additional height for the component that you want to extend over the header, similar to a list header.',
		},
		header: {
			control: 'text',
			description:
				'The header component displayed at the top, with portions that may be hidden when the scrollable view is scrolled.',
		},
		children: {
			control: 'text',
			description: 'The children of the scrollable view',
		},
		classNames: {
			container: {
				control: 'text',
				description:
					'The Tailwind className for the container of the whole component.',
			},
			content: {
				control: 'text',
				description: 'The Tailwind className for the scrollable view',
			},
		},
	},
} satisfies Meta<typeof NestedScrollView>

export default meta
type Story = StoryObj<typeof meta>

export const MobileScrollList: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'iphone14promax',
		},
	},
	args: {
		header: (
			<div className="h-[286px] overflow-y-hidden overflow-x-scroll">
				<div className="h-full w-screen bg-green-200">Slider 1</div>
			</div>
		),
		children: (
			<>
				<div className="sticky left-0 top-0 h-5 w-full bg-purple-950">
					List Title
				</div>
				<div className="bg-purple-400">
					{Array.from(new Array(100))
						.fill(null)
						.map((_, index) => {
							return <div key={index}>Long List {index}</div>
						})}
				</div>
			</>
		),
		scrollableDistance: 200,
		minDistanceToTop: 186,
		extraHeight: 20,
		classNames: {
			container: 'bg-red-300',
			content: 'bg-purple-400',
		},
	},
	render: function Render(args) {
		return (
			<NestedScrollView
				header={args.header}
				scrollableDistance={args.scrollableDistance}
				minDistanceToTop={args.minDistanceToTop}
				classNames={args.classNames}
				extraHeight={args.extraHeight}
			>
				{args.children}
			</NestedScrollView>
		)
	},
}
export const DesktopScrollList: Story = {
	args: {
		header: (
			<div className="h-[286px] overflow-y-hidden overflow-x-scroll">
				<div className="h-full w-screen bg-green-200">Slider 1</div>
			</div>
		),
		children: (
			<>
				<div className="sticky left-0 top-0 h-5 w-full bg-purple-950">
					List Title
				</div>
				<div className="bg-purple-400">
					{Array.from(new Array(100))
						.fill(null)
						.map((_, index) => {
							return <div key={index}>Long List {index}</div>
						})}
				</div>
			</>
		),
		scrollableDistance: 200,
		minDistanceToTop: 186,
		extraHeight: 20,
		classNames: {
			container: 'bg-red-300',
			content: 'bg-purple-400',
		},
	},
	render: function Render(args) {
		return (
			<NestedScrollView
				header={args.header}
				scrollableDistance={args.scrollableDistance}
				minDistanceToTop={args.minDistanceToTop}
				classNames={args.classNames}
				extraHeight={args.extraHeight}
			>
				{args.children}
			</NestedScrollView>
		)
	},
}
