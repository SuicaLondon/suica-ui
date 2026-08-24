import { readFile } from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'

const entryPath = path.resolve('tailwind.css')
const input = await readFile(entryPath, 'utf8')
const result = await postcss([tailwindcss()]).process(input, {
	from: entryPath,
})

const expectedSelectors = [
	'.sui\\:size-13',
	'.sui\\:px-7',
	'.sui\\:animate-skeleton-shimmer',
]

for (const selector of expectedSelectors) {
	if (!result.css.includes(selector)) {
		throw new Error(`Consumer Tailwind entry did not generate ${selector}`)
	}
}

const expectedFragments = [
	'@keyframes sui-skeleton-shimmer',
	'background-position: -200% 0',
	'@media (prefers-reduced-motion: reduce)',
]

for (const fragment of expectedFragments) {
	if (!result.css.includes(fragment)) {
		throw new Error(`Consumer Tailwind entry did not preserve ${fragment}`)
	}
}
