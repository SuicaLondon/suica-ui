'use client'

import { useEffect } from 'react'

export function TabsLifecyclePanel({
	label,
	onEvent,
}: {
	label: string
	onEvent: (event: string) => void
}) {
	useEffect(() => {
		onEvent(`${label} mounted`)
		return () => onEvent(`${label} unmounted`)
	}, [label, onEvent])
	return <input aria-label={`${label} state`} defaultValue={label} />
}
