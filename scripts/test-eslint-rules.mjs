import assert from 'node:assert/strict'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import postcss from 'postcss'
import { hasArbitraryValue } from '../eslint-rules/arbitrary-values.mjs'
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
			'suica/no-arbitrary-leading': 'error',
			'suica/no-arbitrary-css-math': 'error',
			'suica/no-arbitrary-blur': 'error',
			'suica/no-css-variable-classes': 'error',
			'suica/prefer-numeric-utilities': 'error',
			'suica/prefer-and-rendering': 'error',
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
	'const element = <div className="w-5 aria-[expanded=true]:block [font:inherit]" />',
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

for (const code of [
	'const element = <div>{count > 0 && <span />}</div>',
	'const element = <div>{enabled ? <span /> : <i />}</div>',
	'const value = enabled ? value : null',
	'const element = <div title={enabled ? title : null} />',
])
	assert.deepEqual(linter.verify(code, config, options), [])
for (const condition of [
	'count',
	'count > 0',
	'enabled',
	'a || b',
	'next()',
	'0',
	'NaN',
]) {
	const code = `const element = <>{${condition} ? <span /> : null}</>`
	const result = linter.verifyAndFix(code, config, options)
	assert.ok(result.fixed, code)
	assert.deepEqual(result.messages, [], result.output)
	assert.ok(result.output.includes('&&'))
	if (condition !== 'count > 0')
		assert.ok(result.output.includes('!!('), result.output)
	assert.equal(linter.verifyAndFix(result.output, config, options).fixed, false)
}
const commented =
	'const element = <div>{enabled ? /* keep */ <span /> : null}</div>'
const result = linter.verifyAndFix(commented, config, options)
assert.equal(result.fixed, false)
assert.equal(result.messages[0].messageId, 'preferAnd')
console.log(
	'Conditional rendering rule: scope, boolean coercion, comments, and stable fixes passed.',
)

for (const value of [
	'leading-tight',
	'md:leading-relaxed',
	'leading-compact',
	'w-5',
]) {
	assert.deepEqual(
		linter.verify(
			`const element = <div className="${value}" />`,
			config,
			options,
		),
		[],
	)
}
for (const value of [
	'leading-[1.25]',
	'md:leading-[1.25]',
	'leading-[1.25]!',
]) {
	const result = linter.verifyAndFix(
		`const element = <div className="${value}" />`,
		config,
		options,
	)
	assert.ok(result.fixed)
	assert.deepEqual(result.messages, [])
	assert.ok(result.output.includes('leading-tight'))
}
for (const value of ['leading-[1.1]', 'leading-(--custom)']) {
	assert.ok(
		linter
			.verify(`const element = <div className="${value}" />`, config, options)
			.some((m) => m.messageId === 'named'),
	)
}
console.log('Named line-height rules passed.')

for (const value of [
	'max-h-[calc(100dvh-var(--inset))]',
	'md:w-[min(32rem,100vw)]',
	'w-[max(1rem,2vw)]',
	'w-[clamp(1rem,2vw,3rem)]',
]) {
	assert.ok(
		linter
			.verify(`const element = <div className="${value}" />`, config, options)
			.some((m) => m.messageId === 'namedMath'),
	)
}
for (const code of [
	'const element = <div className="menu-viewport max-w-full w-5" />',
	'const style = { width: "calc(100vw - 1rem)" }',
	'const value = Math.max(0, count)',
])
	assert.deepEqual(linter.verify(code, config, options), [])
console.log('CSS math rule scope and function checks passed.')

for (const value of [
	'text-[var(--icon)]',
	'hover:bg-(--surface)',
	'text-(color:--icon)',
	'bg-[linear-gradient(var(--a),var(--b))]',
]) {
	assert.ok(
		linter
			.verify(`const element = <div className="${value}" />`, config, options)
			.some((m) => m.messageId === 'themeVariable'),
	)
}
for (const code of [
	'const element = <div className="text-icon skeleton-accent" />',
	'const style = { color: "var(--icon)" }',
])
	assert.deepEqual(linter.verify(code, config, options), [])
console.log('CSS variable class rule checks passed.')

for (const [before, after] of [
	['pt-[4.5rem]', 'pt-18'],
	['md:gap-y-[22px]', 'md:gap-y-5.5'],
	['size-[1.375rem]', 'size-5.5'],
	['mb-[-1px]', '-mb-0.25'],
	['-mt-[4px]', '-mt-1'],
	['focus-visible:outline-offset-[-2px]', 'focus-visible:-outline-offset-2'],
	['disabled:opacity-[0.45]', 'disabled:opacity-45'],
	['duration-[180ms]', 'duration-180'],
]) {
	const result = linter.verifyAndFix(
		`const element = <div className="${before}" />`,
		config,
		options,
	)
	assert.ok(result.fixed)
	assert.deepEqual(result.messages, [])
	assert.ok(result.output.includes(after), result.output)
	assert.equal(linter.verifyAndFix(result.output, config, options).fixed, false)
}
console.log('Numeric utility conversion and stable fixes passed.')

for (const code of [
	'const element = <div className="backdrop-blur-[1px]" />',
	'const element = <div className="md:hover:blur-[2px]!" />',
	"const classes = cn('backdrop-blur-[1px]')",
	"const classes = cn({ 'blur-[2px]': enabled })",
	'const classes = `blur-[2px]`',
	'const element = <div className="backdrop-blur-(--custom)" />',
]) {
	assert.ok(
		linter.verify(code, config, options).some((m) => m.messageId === 'namedBlur'),
		code,
	)
}
for (const code of [
	'const element = <div className="backdrop-blur-overlay blur-sm" />',
	'const description = "backdrop-blur-[1px]"',
	'const style = { backdropFilter: "blur(1px)" }',
	'const element = <div className="custom-blur-[1px]" />',
])
	assert.deepEqual(linter.verify(code, config, options), [])
console.log('Named blur rule and scope checks passed.')

const styleConfig = [
	{
		files: ['**/*.tsx'],
		languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
		plugins: { suica: classnames },
		rules: {
			'suica/no-static-inline-styles': 'error',
			'suica/no-arbitrary-values': 'error',
		},
	},
]
for (const filename of [
	'src/example.tsx',
	'src/example.stories.tsx',
	'.storybook/example.tsx',
]) {
	const fileOptions = { filename: path.resolve(filename) }
	for (const code of [
		'const view = <div style={{ padding: 16 }} />',
		'const view = <div style={{ top: offset, padding: 16 }} />',
		'const fixed = { padding: 16 }; const view = <div style={fixed} />',
		'const fixed = { padding: 16 }; const view = <div style={{ ...fixed, top: offset }} />',
		'const args = { style: { color: "red" } }',
		'const padding = 16; const view = <div style={{ padding }} />',
		'const view = <div style={{ padding: `${16}px` }} />',
		'const view = <div style={{ padding: 8 * 2 } as CSSProperties} />',
		'const view = <div style={enabled ? { padding: 16 } : undefined} />',
	])
		assert.ok(
			linter
				.verify(code, styleConfig, fileOptions)
				.some((m) => m.messageId === 'staticStyle'),
			code,
		)
	for (const code of [
		'const view = <div style={{ top: offset }} />',
		'const view = <div style={{ height: `calc(100dvh - ${offset}px)` }} />',
		'const view = <div style={{ top: position?.top ?? 0 }} />',
		'const view = <div style={{ width: "var(--width)", "--offset": offset }} />',
		'const view = <div style={{ ...style, top: offset }} />',
		'const fixed = { padding: 16 }; const view = <div data-value={fixed} />',
		'const view = <div className="aria-[invalid=grammar]:border-danger data-[state=open]:block" />',
		'const view = <div className="has-[input[aria-invalid=true]]:border-danger" />',
	])
		assert.deepEqual(linter.verify(code, styleConfig, fileOptions), [], code)
	for (const code of [
		'const view = <div className="text-[11px]" />',
		'const view = <div className="hover:[font:inherit]" />',
		'const view = <div className="data-[state=open]:w-[20px]" />',
		'const view = <div className="text-(--color)" />',
		'const classes = cn({ "mt-[0.2em]": enabled })',
		'const args = { className: "bg-[#ffffff]" }',
		'const classes = `w-[20px]`',
	])
		assert.ok(
			linter
				.verify(code, styleConfig, fileOptions)
				.some((m) => m.messageId === 'arbitrary'),
			code,
		)
}
console.log(
	'Project-wide arbitrary value and dynamic inline style rules passed, including stories.',
)

for (const file of [
	'styles/shared.css',
	'src/styles.css',
	'tailwind.css',
	'.storybook/styles.css',
]) {
	const css = postcss.parse(await readFile(file, 'utf8'), { from: file })
	css.walkAtRules('apply', (rule) =>
		assert.equal(
			hasArbitraryValue(rule.params),
			false,
			`${file}:${rule.source.start.line}: arbitrary @apply value`,
		),
	)
}
console.log('Stylesheet @apply arbitrary value checks passed.')
