import {
	forwardRef,
	useId,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type KeyboardEvent,
} from 'react'
import { cn } from '../cn.js'
import type {
	TabItem,
	TabsActivationMode,
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
	listClassName?: string
}

const tabsListVariantClassName: Record<TabsVariant, string> = {
	segmented:
		'sui:w-fit sui:max-w-full sui:rounded-control sui:border sui:border-line sui:bg-hover sui:p-1 sui:aria-[orientation=vertical]:w-full',
	underline:
		'sui:border-b sui:border-line sui:aria-[orientation=vertical]:border-b-0 sui:aria-[orientation=vertical]:border-s',
}

const tabsTriggerVariantClassName: Record<
	TabsVariant,
	Record<TabsOrientation, string>
> = {
	segmented: {
		horizontal:
			'sui:justify-center sui:rounded-control sui:border sui:border-transparent sui:data-[state=active]:border-line sui:data-[state=active]:bg-surface sui:data-[state=active]:shadow-sm',
		vertical:
			'sui:w-full sui:justify-start sui:rounded-control sui:border sui:border-transparent sui:data-[state=active]:border-line sui:data-[state=active]:bg-surface sui:data-[state=active]:shadow-sm',
	},
	underline: {
		horizontal:
			'sui:mb-[-1px] sui:justify-center sui:rounded-t-control sui:border-b-2 sui:border-b-transparent sui:data-[state=active]:border-b-accent',
		vertical:
			'sui:ms-[-1px] sui:justify-start sui:rounded-e-control sui:border-s-2 sui:border-s-transparent sui:data-[state=active]:border-s-accent',
	},
}

const tabStateBySelection: Record<0 | 1, TabState> = {
	0: 'inactive',
	1: 'active',
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
				'sui:w-full sui:box-border sui:text-foreground sui:[&_*]:box-border sui:font-[family-name:var(--sui-theme-font-sans)]',
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
					'sui:m-0 sui:flex sui:gap-1 sui:overflow-x-auto sui:[scrollbar-width:none] sui:[&::-webkit-scrollbar]:hidden sui:aria-[orientation=vertical]:flex-col sui:aria-[orientation=vertical]:items-stretch sui:aria-[orientation=vertical]:overflow-visible',
					tabsListVariantClassName[variant],
					listClassName,
				)}
			>
				{tabs.map((tab, index) => {
					const isSelected = tab.id === effectiveValue
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
							aria-controls={tab.panel === undefined ? undefined : panelId}
							disabled={tab.disabled}
							tabIndex={index === rovingIndex ? 0 : -1}
							data-state={tabState}
							data-slot="tabs-trigger"
							className={cn(
								'sui:m-0 sui:inline-flex sui:min-h-11 sui:cursor-pointer sui:touch-manipulation sui:appearance-none sui:items-center sui:border-0 sui:bg-transparent sui:px-4 sui:py-3 sui:text-start sui:text-xs sui:leading-[1.25] sui:font-medium sui:tracking-[0.08em] sui:whitespace-nowrap sui:text-muted sui:uppercase sui:transition-[border-color,background-color,color] sui:duration-150 sui:ease-[ease] sui:hover:bg-hover sui:hover:text-accent sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-[-2px] sui:disabled:cursor-not-allowed sui:disabled:opacity-[0.45] sui:data-[state=active]:text-accent sui:motion-reduce:transition-none sui:font-[family-name:var(--sui-theme-font-mono)]',
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
							'sui:mt-3 sui:rounded-control sui:border sui:border-line sui:bg-surface sui:p-4 sui:text-foreground sui:leading-[1.6] sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-2',
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
