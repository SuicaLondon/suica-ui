export const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

export function getFocusableElements(container: ParentNode) {
	return Array.from(
		container.querySelectorAll<HTMLElement>(focusableSelector),
	).filter(
		(element) =>
			element.tabIndex >= 0 &&
			!element.closest('[inert]') &&
			!element.closest('[aria-hidden="true"]'),
	)
}

/** Handle Tab boundaries for both native dialogs and custom modal sidebars. */
export function trapFocus(
	event: Pick<
		KeyboardEvent,
		'key' | 'shiftKey' | 'defaultPrevented' | 'preventDefault'
	>,
	container: HTMLElement,
) {
	if (event.defaultPrevented || event.key !== 'Tab') return
	const elements = getFocusableElements(container)
	const first = elements[0]
	const last = elements.at(-1)
	if (!first || !last) {
		event.preventDefault()
		container.focus()
		return
	}
	const activeElement = document.activeElement
	const outside =
		activeElement instanceof Node && !container.contains(activeElement)
	if (event.shiftKey && (activeElement === first || outside)) {
		event.preventDefault()
		last.focus()
		return
	}
	if (!event.shiftKey && (activeElement === last || outside)) {
		event.preventDefault()
		first.focus()
	}
}
