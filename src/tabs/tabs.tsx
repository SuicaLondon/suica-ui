import clsx from 'clsx'
import { memo, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFocus } from './hooks/useFocus'
import { AlignDirection, AlignDirectionKey, TabProps } from './tab.type'

export interface ITabsProps {
	tabs: TabProps[]
	activeTabId: string
	direction?: AlignDirectionKey
	onChange?: ({ id }: { id: TabProps['id'] }) => void
}

export const Tabs = memo(
	({
		tabs,
		activeTabId,
		direction = AlignDirection.horizontal,
		onChange,
	}: ITabsProps) => {
		const [activeIndex, setActiveIndex] = useState(
			(activeTabId && tabs.findIndex((tab) => activeTabId === tab.id)) || 0,
		)
		const tabRefs = tabs.map(() => useRef<HTMLDivElement>(null))
		const { focusNext, focusPrevious } = useFocus(tabRefs)

		useEffect(() => {
			tabRefs[activeIndex].current?.focus()
		}, [activeIndex, tabRefs])

		const handleChangeTab = (index: number) => {
			setActiveIndex(index)
			const tabDetails = tabs[index]
			if (onChange) {
				onChange({
					id: tabDetails.id,
				})
			}
		}

		const handleKeyDown = (index: number) => {
			return (event: React.KeyboardEvent<HTMLInputElement>): void => {
				switch (event.key) {
					// space bar
					case ' ':
					case 'Enter':
						handleChangeTab(index)
						break
					case 'ArrowUp':
						if (direction == AlignDirection.vertical) {
							focusPrevious(index)
						}
						break
					case 'ArrowDown':
						if (direction == AlignDirection.vertical) {
							focusNext(index)
						}
						break
					case 'ArrowRight':
						if (direction == AlignDirection.horizontal) {
							focusNext(index)
						}
						break
					case 'ArrowLeft':
						if (direction == AlignDirection.horizontal) {
							focusPrevious(index)
						}
						break
				}
			}
		}

		const renderTabBorderClassNames = (isSelected: boolean) => {
			if (direction == AlignDirection.horizontal) {
				return clsx('ml-4 px-4 py-3', {
					'border-none ml-0 text-bold bg-gray-800 text-white rounded-lg': isSelected,
				})
			}
			return clsx('ml-4 pl-4 py-3 -translate-x-4', {
				'border-none ml-0 text-bold bg-gray-800 text-white rounded-lg': isSelected,
			})
		}

		return (
			<div
				role="tablist"
				className={clsx('relative flex', {
					'ml-4 flex-col border-l border-gray-800':
						direction == AlignDirection.vertical,
				})}
			>
				{tabs.map((tab, index) => (
					<div
						role="tab"
						tabIndex={0}
						ref={tabRefs[index]}
						key={index}
						onKeyDown={handleKeyDown(index)}
						onClick={() => handleChangeTab(index)}
						className={twMerge(
							'cursor-pointer transition-all',
							renderTabBorderClassNames(tab.id === activeTabId),
						)}
					>
						{tab.label}
					</div>
				))}
			</div>
		)
	},
)
Tabs.displayName = 'Tabs'
