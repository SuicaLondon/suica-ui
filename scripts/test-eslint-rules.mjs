import assert from 'node:assert/strict'
import path from 'node:path'
import { Linter } from 'eslint'
import parser from '@typescript-eslint/parser'
import classnames from '../eslint-rules/classnames.mjs'

const linter = new Linter()
const config = [
	{
		files: ['**/*.tsx'],
		languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
		plugins: { suica: classnames },
		rules: {
			'suica/consistent-classnames': ['error', { maxLength: 80 }],
			'suica/no-arbitrary-variants': 'error',
		},
	},
]
const options = { filename: path.resolve('src/example/example.tsx') }
const longClasses = Array.from({ length: 20 }, (_, index) => `p-${index}`).join(
	' ',
)
const valid = [
	"const positionStyle = { '--offset': `${offset}px` }",
	`const selector = '[role="menuitem"]:not([disabled])'`,

	'const element = <div className="p-4 text-sm" />',
	'const element = <div className={classes} />',
	'const props = { className }',
	"import { cn } from '../cn.js'; const element = <div className={cn('p-4', className)} />",
	'const element = <div className="w-[20px] aria-[expanded=true]:block [font:inherit]" />',
	`const description = '${longClasses}'`,
]
for (const code of valid)
	assert.deepEqual(linter.verify(code, config, options), [])
for (const code of [
	` 'use client'; const element = <div className="${longClasses}" />`.trim(),
	`const classes = '${longClasses}'`,
	`import { cn } from '../cn.js'; const classes = cn('${longClasses}')`,
	`import { cn } from '../cn.js'; const classes = cn({ '${longClasses}': enabled })`,
]) {
	const result = linter.verifyAndFix(code, config, options)
	assert.ok(result.fixed, code)
	assert.deepEqual(result.messages, [], result.output)
	assert.equal(linter.verifyAndFix(result.output, config, options).fixed, false)
	if (code.startsWith("'use client'"))
		assert.ok(result.output.startsWith("'use client';"))
}
for (const value of [
	'[&>svg]:size-4',
	'hover:[&_button]:bg-red-500',
	'[.parent_&]:block',
	'[@supports(display:grid)]:grid',
]) {
	assert.ok(
		linter
			.verify(`const element = <div className="${value}" />`, config, options)
			.some((m) => m.messageId === 'selector'),
	)
}
for (const code of [
	`const element = <div className={'p-4 ' + className} />`,
	'const element = <div className={`p-4 ${className}`} />',
])
	assert.ok(
		linter.verify(code, config, options).some((m) => m.messageId === 'useCn'),
	)
console.log(
	'Classname rules: valid cases, selector rejection, composition, and stable auto-fixes passed.',
)
