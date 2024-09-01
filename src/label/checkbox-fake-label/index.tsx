import React from 'react'

type CheckboxFakeLabelProps = {
	label?: string
}

export function CheckboxFakeLabel({ label }: CheckboxFakeLabelProps) {
	if (!label) {
		return null
	}
	return <span className="text-primary-dark text-sm">{label}</span>
}
