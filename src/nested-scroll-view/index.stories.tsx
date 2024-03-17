import type { Meta, StoryObj } from '@storybook/react'
import { NestedScrollView } from './nested-scroll-view'

const meta = {
	title: 'Example/NestedScrollView',
	component: NestedScrollView,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof NestedScrollView>

export default meta
type Story = StoryObj<typeof meta>

export const MobileScrollList: Story = {
	args: {
		header: (
			<div className="h-[286px] overflow-x-scroll overflow-y-hidden">
				<div className="w-screen h-full bg-green-200">Slider 1</div>
			</div>
		),
		children: (
			<>
				<div className="w-full h-5 sticky left-0 top-0 bg-purple-950">header</div>
				<div className="bg-purple-400">
					{Array.from(new Array(100))
						.fill(null)
						.map((_, index) => {
							return <div key={index}>Game List {index}</div>
						})}
				</div>
			</>
		),
		scrollableDistance: 100,
		minDistanceToTop: 186,
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
			>
				{args.children}
			</NestedScrollView>
		)
	},
}
