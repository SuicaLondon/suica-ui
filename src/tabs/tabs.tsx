import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFocus } from './hooks/useFocus'
import { ALIGN_DIRECTION, TabProps } from './tab.type'

export interface ITabsProps {
	tabs: TabProps[]
	activeTabId: string
	direction?: ALIGN_DIRECTION
	onChange?: ({ id }: { id: TabProps['id'] }) => void
}

export const Tabs = ({
	tabs,
	activeTabId,
	direction = ALIGN_DIRECTION.HORIZONTAL,
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
					if (direction == ALIGN_DIRECTION.VERTICAL) {
						focusPrevious(index)
					}
					break
				case 'ArrowDown':
					if (direction == ALIGN_DIRECTION.VERTICAL) {
						focusNext(index)
					}
					break
				case 'ArrowRight':
					if (direction == ALIGN_DIRECTION.HORIZONTAL) {
						focusNext(index)
					}
					break
				case 'ArrowLeft':
					if (direction == ALIGN_DIRECTION.HORIZONTAL) {
						focusPrevious(index)
					}
					break
			}
		}
	}

	const renderTabBorderClassNames = (isSelected: boolean) => {
		if (direction == ALIGN_DIRECTION.HORIZONTAL) {
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
				'flex-col border-l ml-4 border-gray-800':
					direction == ALIGN_DIRECTION.VERTICAL,
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
}
