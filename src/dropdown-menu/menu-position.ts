export type MenuSide = 'top' | 'bottom'
export type MenuAlign = 'start' | 'center' | 'end'

export interface MenuPosition {
	left: number
	top: number
	side: MenuSide
}

const menuGap = 6

function getSide(
	preferredSide: MenuSide,
	availableAbove: number,
	availableBelow: number,
	requiredHeight: number,
): MenuSide {
	if (
		preferredSide === 'bottom' &&
		availableBelow < requiredHeight &&
		availableAbove > availableBelow
	)
		return 'top'
	if (
		preferredSide === 'top' &&
		availableAbove < requiredHeight &&
		availableBelow > availableAbove
	)
		return 'bottom'
	return preferredSide
}

function getLeft(
	trigger: DOMRect,
	contentWidth: number,
	align: MenuAlign,
	rtl: boolean,
) {
	if (align === 'center')
		return trigger.left + (trigger.width - contentWidth) / 2
	const alignRight = (align === 'start' && rtl) || (align === 'end' && !rtl)
	if (alignRight) return trigger.right - contentWidth
	return trigger.left
}

function clampToViewport(
	position: number,
	size: number,
	viewportSize: number,
	padding: number,
) {
	return Math.min(
		Math.max(position, padding),
		Math.max(padding, viewportSize - size - padding),
	)
}

/** Keep placement decisions independent of React rendering and focus management. */
export function getMenuPosition(
	trigger: HTMLElement,
	content: HTMLElement,
	preferredSide: MenuSide,
	align: MenuAlign,
	padding: number,
): MenuPosition {
	const triggerRect = trigger.getBoundingClientRect()
	const contentRect = content.getBoundingClientRect()
	const side = getSide(
		preferredSide,
		triggerRect.top - padding,
		window.innerHeight - triggerRect.bottom - padding,
		contentRect.height + menuGap,
	)
	const left = getLeft(
		triggerRect,
		contentRect.width,
		align,
		getComputedStyle(trigger).direction === 'rtl',
	)
	let top = triggerRect.bottom + menuGap
	if (side === 'top') top = triggerRect.top - contentRect.height - menuGap
	return {
		left: clampToViewport(left, contentRect.width, window.innerWidth, padding),
		top: clampToViewport(top, contentRect.height, window.innerHeight, padding),
		side,
	}
}
