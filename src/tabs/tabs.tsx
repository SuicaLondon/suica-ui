import { ReactNode, useEffect, useRef, useState } from 'react'
import { ALIGN_DIRECTION, TabProps } from './tab.type'
import { twMerge } from 'tailwind-merge'
import classNames from 'classnames'
import { useFocus } from './hooks/useFocus'

export interface TabsProps {
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
}: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(
    (activeTabId && tabs.findIndex((tab) => activeTabId === tab.id)) || 0
  )

  const [activeIndicatorDimensions, setActiveIndicatorDimensions] = useState<{
    offset: number | undefined
    length: number | undefined
  }>({
    offset: undefined,
    length: undefined,
  })

  const tabRefs = tabs.map(() => useRef<HTMLDivElement>(null))
  const { focusNext, focusPrevious } = useFocus(tabRefs)

  const handleChangeTab = (index: number) => {
    setActiveIndex(index)
    const tabDetails = tabs[index]
    if (onChange) {
      onChange({
        id: tabDetails.id,
      })
    }
  }

  const handleKeyDown =
    (index: number) =>
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
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

  useEffect(() => {
    tabRefs[activeIndex].current?.focus()
  }, [activeIndex, tabRefs])

  useEffect(() => {
    const activeTab = tabRefs[activeIndex].current
    if (direction == ALIGN_DIRECTION.HORIZONTAL) {
      setActiveIndicatorDimensions({
        offset: activeTab?.offsetTop,
        length: activeTab?.offsetHeight,
      })
    } else {
      setActiveIndicatorDimensions({
        offset: activeTab?.offsetLeft,
        length: activeTab?.offsetWidth,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabRefs[activeIndex].current])

  const renderTabBorderClassNames = (isSelected: boolean) => {
    if (direction == ALIGN_DIRECTION.HORIZONTAL) {
      return classNames('ml-4 px-4 py-3', {
        ['border-none ml-0 text-bold bg-gray-800 text-white rounded-lg' || '']:
          isSelected,
      })
    }
    return classNames('ml-4 pl-4 py-3 border-l border-gray-800', {
      ['border-none ml-0 text-bold bg-gray-800 text-white rounded-lg' || '']:
        isSelected,
    })
  }

  return (
    <div
      role="tablist"
      className={twMerge(
        classNames('relative flex'),
        direction == ALIGN_DIRECTION.VERTICAL ? 'flex-col' : ''
      )}
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
            renderTabBorderClassNames(tab.id === activeTabId)
          )}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}
