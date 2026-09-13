'use client'

import { useCallback, useState } from 'react'

/** Share controlled/uncontrolled state without retaining callbacks from abandoned renders. */
export function useControllableBoolean(
	controlledValue: boolean | undefined,
	defaultValue: boolean,
	onChange: ((value: boolean) => void) | undefined,
) {
	const [internalValue, setInternalValue] = useState(defaultValue)
	const value = controlledValue ?? internalValue
	const setValue = useCallback(
		(nextValue: boolean) => {
			if (controlledValue === undefined) setInternalValue(nextValue)
			if (nextValue !== value) onChange?.(nextValue)
		},
		[controlledValue, onChange, value],
	)
	return [value, setValue] as const
}
