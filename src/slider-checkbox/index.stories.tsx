import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SliderCheckbox } from './slider-checkbox'

const meta = {
	title: 'Example/SliderCheckbox',
	component: SliderCheckbox,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: { onChecked: { action: 'clicked' } },
} satisfies Meta<typeof SliderCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const IntList: Story = {
	name: 'Int list',
	args: {
		selectedIndex: 0,
		values: [1, 2, 3],
	},
	render: function Render(args) {
		const values: number[] = args.values as number[]
		const [selectedIndex, setSelectedIndex] = useState<number>(args.selectedIndex)

		function onChange(value: number, index: number) {
			setSelectedIndex(index)
		}

		return (
			<SliderCheckbox
				values={values}
				selectedIndex={selectedIndex}
				onChecked={onChange}
			/>
		)
	},
}

export const StringList: Story = {
	name: 'Int list',
	args: {
		selectedIndex: 1,
		values: ['Penguin 1', 'Penguin 2', 'Penguin 3', 'Penguin 4'],
	},
	render: function Render(args) {
		const values: string[] = args.values as string[]
		const [selectedIndex, setSelectedIndex] = useState<number>(args.selectedIndex)

		function onChange(value: string, index: number) {
			setSelectedIndex(index)
		}

		return (
			<SliderCheckbox
				values={values}
				selectedIndex={selectedIndex}
				onChecked={onChange}
			/>
		)
	},
}
