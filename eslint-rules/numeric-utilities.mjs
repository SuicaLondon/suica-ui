// Tailwind's default spacing unit is 0.25rem (4px at a 16px root size).
export function normalizeNumericUtilities(value) {
	return value
		.replace(
			/(?<![\w-])(-?)(p[trblxyse]?|m[trblxyse]?|gap(?:-[xy])?|space-[xy]|w|h|size|min-[wh]|max-[wh]|inset(?:-[xy])?|top|right|bottom|left|start|end|translate-[xy])-\[(-?\d*\.?\d+)(rem|px)\]/gu,
			(_, sign, utility, number, unit) => {
				const amount =
					Number(number) * (unit === 'rem' ? 4 : 0.25) * (sign ? -1 : 1)
				const negative = amount < 0 ? '-' : ''
				return `${negative}${utility}-${Math.abs(amount)}`
			},
		)
		.replace(
			/outline-offset-\[(-?\d+)px\]/gu,
			(_, number) =>
				`${Number(number) < 0 ? '-' : ''}outline-offset-${Math.abs(Number(number))}`,
		)
		.replace(
			/opacity-\[(0(?:\.\d+)?|1(?:\.0+)?)\]/gu,
			(_, number) => `opacity-${Number((Number(number) * 100).toFixed(8))}`,
		)
		.replace(/duration-\[(\d+)ms\]/gu, 'duration-$1')
		.replace(/ease-\[(ease-in|ease-out|ease-in-out)\]/gu, '$1')
}
