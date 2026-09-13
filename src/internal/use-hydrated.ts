'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined
const getSnapshot = () => true
const getServerSnapshot = () => false

/** Keep the server and first hydration render identical before using browser-only content. */
export function useHydrated() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
