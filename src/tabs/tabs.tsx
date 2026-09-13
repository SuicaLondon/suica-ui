'use client'

import {
	forwardRef,
	useId,
	useEffect,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type KeyboardEvent,
} from 'react'
import { cn } from '../cn.js'
import type {
	TabItem,
	TabsActivationMode,
	TabsMountStrategy,
	TabsOrientation,
	TabsVariant,
} from './tab.type.js'

type TabState = 'active' | 'inactive'

export interface TabsProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'defaultValue' | 'onChange'
> {
	tabs: readonly TabItem[]
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	orientation?: TabsOrientation
	activationMode?: TabsActivationMode
	variant?: TabsVariant
	mountStrategy?: TabsMountStrategy
	listClassName?: string
}

const tabsListVariantClassName: Record<TabsVariant, string> = {
	segmented: cn(
		'w-fit max-w-full rounded-control border border-line',
		'bg-hover p-1 aria-[orientation=vertical]:w-full',
	),
	underline: cn(
		'border-b border-line aria-[orientation=vertical]:border-b-0',
		'aria-[orientation=vertical]:border-s',
	),
}

const tabsTriggerVariantClassName: Record<
	TabsVariant,
	Record<TabsOrientation, string>
> = {
	segmented: {
		horizontal: cn(
			'justify-center rounded-control border border-transparent',
			'data-[state=active]:border-line data-[state=active]:bg-surface',
		),
		vertical: cn(
			'w-full justify-start rounded-control border',
			'border-transparent data-[state=active]:border-line',
			'data-[state=active]:bg-surface',
		),
	},
	underline: {
		horizontal: cn(
			'-mb-0.25 justify-center rounded-t-control border-b-2',
			'border-b-transparent data-[state=active]:border-b-accent',
		),
		vertical: cn(
			'-ms-0.25 justify-start rounded-e-control border-s-2',
			'border-s-transparent data-[state=active]:border-s-accent',
		),
	},
}

const tabStateBySelection: Record<0 | 1, TabState> = {
	0: 'inactive',
	1: 'active',
}

function shouldMountPanel(
	tab: TabItem,
	selectedValue: string | undefined,
	strategy: TabsMountStrategy,
	visited: ReadonlySet<string>,
) {
	if (tab.panel === undefined) return false
	if (strategy === 'always' || tab.id === selectedValue) return true
	return strategy === 'lazy' && visited.has(tab.id)
}

function findFirstEnabledIndex(tabs: readonly TabItem[]) {
	return tabs.findIndex((tab) => !tab.disabled)
}

function findNextEnabledIndex(
	tabs: readonly TabItem[],
	startIndex: number,
	delta: 1 | -1,
) {
	if (tabs.length === 0) return -1

	for (let offset = 1; offset <= tabs.length; offset += 1) {
		const index = (startIndex + delta * offset + tabs.length) % tabs.length
		if (!tabs[index]?.disabled) return index
	}

	return -1
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
	{
		tabs,
		value,
		defaultValue,
		onValueChange,
		orientation = 'horizontal',
		activationMode = 'automatic',
		variant = 'underline',
		mountStrategy = 'always',
		listClassName,
		className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...props
	},
	ref,
) {
	const baseId = useId()
	const firstEnabledIndex = findFirstEnabledIndex(tabs)
	const firstEnabledValue = tabs[firstEnabledIndex]?.id
	const [internalValue, setInternalValue] = useState(
		defaultValue ?? firstEnabledValue,
	)
	const requestedValue = value ?? internalValue
	const selectedIndex = tabs.findIndex(
		(tab) => tab.id === requestedValue && !tab.disabled,
	)
	const effectiveIndex = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex
	const effectiveValue = tabs[effectiveIndex]?.id
	const [focusedIndex, setFocusedIndex] = useState(effectiveIndex)
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
	const [visitedPanels, setVisitedPanels] = useState(() => new Set<string>())
	useEffect(() => {
		if (effectiveValue === undefined) return
		setVisitedPanels((visited) =>
			visited.has(effectiveValue)
				? visited
				: new Set([...visited, effectiveValue]),
		)
	}, [effectiveValue])
	const rovingIndex =
		activationMode === 'manual' &&
		tabs[focusedIndex] &&
		!tabs[focusedIndex]?.disabled
			? focusedIndex
			: effectiveIndex

	function selectTab(index: number) {
		const tab = tabs[index]
		if (!tab || tab.disabled) return
		if (value === undefined) setInternalValue(tab.id)
		if (tab.id !== effectiveValue) onValueChange?.(tab.id)
	}

	function focusTab(index: number) {
		if (index < 0) return
		setFocusedIndex(index)
		tabRefs.current[index]?.focus()
		if (activationMode === 'automatic') selectTab(index)
	}

	function handleKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	) {
		const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
		const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

		if (event.key === previousKey || event.key === nextKey) {
			event.preventDefault()
			focusTab(findNextEnabledIndex(tabs, index, event.key === nextKey ? 1 : -1))
			return
		}

		if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault()
			const targetIndex =
				event.key === 'Home'
					? firstEnabledIndex
					: findNextEnabledIndex(tabs, firstEnabledIndex, -1)
			focusTab(targetIndex)
			return
		}

		if (
			activationMode === 'manual' &&
			(event.key === 'Enter' || event.key === ' ')
		) {
			event.preventDefault()
			selectTab(index)
		}
	}

	return (
		<div
			ref={ref}
			data-slot="tabs"
			className={cn(
				'border-box-children box-border w-full text-foreground',
				'font-sans',
				className,
			)}
			{...props}
		>
			<div
				role="tablist"
				data-slot="tabs-list"
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-orientation={orientation}
				className={cn(
					'm-0 flex gap-1 overflow-x-auto',
					'scrollbar-none aria-[orientation=vertical]:flex-col',
					'aria-[orientation=vertical]:items-stretch',
					'aria-[orientation=vertical]:overflow-visible',
					tabsListVariantClassName[variant],
					listClassName,
				)}
			>
				{tabs.map((tab, index) => {
					const isSelected = tab.id === effectiveValue
					const hasMountedPanel = shouldMountPanel(
						tab,
						effectiveValue,
						mountStrategy,
						visitedPanels,
					)
					const tabState = tabStateBySelection[Number(isSelected) as 0 | 1]
					const tabId = `${baseId}-tab-${index}`
					const panelId = `${baseId}-panel-${index}`

					return (
						<button
							key={tab.id}
							ref={(element) => {
								tabRefs.current[index] = element
							}}
							id={tabId}
							type="button"
							role="tab"
							aria-selected={isSelected}
							aria-controls={hasMountedPanel ? panelId : undefined}
							disabled={tab.disabled}
							tabIndex={index === rovingIndex ? 0 : -1}
							data-state={tabState}
							data-slot="tabs-trigger"
							className={cn(
								'm-0 inline-flex min-h-11 cursor-pointer touch-manipulation',
								'appearance-none items-center border-0 bg-transparent px-4',
								'py-3 text-start text-xs leading-tight font-medium',
								'tracking-tab whitespace-nowrap text-muted uppercase',
								'transition-tab-colors duration-150',
								'ease-natural hover:bg-hover hover:text-accent',
								'focus-visible:outline-2 focus-visible:outline-focus',
								'focus-visible:-outline-offset-2 disabled:cursor-not-allowed',
								'disabled:opacity-45 data-[state=active]:text-accent',
								'motion-reduce:transition-none',
								'font-mono',
								tabsTriggerVariantClassName[variant][orientation],
								tab.className,
							)}
							onClick={() => selectTab(index)}
							onFocus={() => setFocusedIndex(index)}
							onKeyDown={(event) => handleKeyDown(event, index)}
						>
							{tab.label}
						</button>
					)
				})}
			</div>

			{tabs.map((tab, index) => {
				if (tab.panel === undefined) return null
				const isSelected = tab.id === effectiveValue
				const shouldMount = shouldMountPanel(
					tab,
					effectiveValue,
					mountStrategy,
					visitedPanels,
				)
				if (!shouldMount) return null

				return (
					<div
						key={tab.id}
						id={`${baseId}-panel-${index}`}
						role="tabpanel"
						data-slot="tabs-panel"
						aria-labelledby={`${baseId}-tab-${index}`}
						tabIndex={0}
						hidden={!isSelected}
						className={cn(
							'mt-3 rounded-control border border-line bg-surface p-4',
							'leading-comfortable text-foreground focus-visible:outline-2',
							'focus-visible:outline-offset-2 focus-visible:outline-focus',
							tab.panelClassName,
						)}
					>
						{tab.panel}
					</div>
				)
			})}
		</div>
	)
})
