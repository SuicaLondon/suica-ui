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
		rules: { 'suica/consistent-classnames': ['error', { maxLength: 80 }] },
	},
]
const options = { filename: path.resolve('src/example/example.tsx') }
const longClasses = Array.from(
	{ length: 12 },
	(_, index) => `sui:p-${index}`,
).join(' ')
const valid = [
	"import { cn } from '../cn.js'; const element = <div className={cn('sui:p-4', 'sui:text-sm')} />",
	`import { cn } from '../cn.js'; const element = <div className={cn('sui:w-[${'1'.repeat(85)}px]')} />`,
]
for (const code of valid)
	assert.deepEqual(linter.verify(code, config, options), [])

const invalid = [
	'\'use client\'; const element = <div className="sui:p-4" />',
	'const element = <div className={classes} />',
	'const props = { className }',
	`const element = <div className="${longClasses}" />`,
	`const variants = { large: '${longClasses}' }`,
	`import { cn } from '../cn.js'; const classes = cn('${longClasses}')`,
	`import { cn } from '../cn.js'; const classes = cn({ '${longClasses}': enabled })`,
]
for (const code of invalid) {
	assert.ok(
		linter.verify(code, config, options).length > 0,
		'Expected the rule to reject the input',
	)
	const result = linter.verifyAndFix(code, config, options)
	assert.ok(result.fixed)
	assert.deepEqual(result.messages, [], result.output)
	assert.deepEqual(
		linter.verify(result.output, config, options),
		[],
		result.output,
	)
	assert.equal(
		linter.verifyAndFix(result.output, config, options).fixed,
		false,
		'Fixes must be stable',
	)
	if (code.startsWith("'use client'"))
		assert.ok(result.output.startsWith("'use client';"))
}
const template = `import { cn } from '../cn.js'; const classes = cn(\`${longClasses}\`)`
assert.ok(
	linter
		.verify(template, config, options)
		.some(({ messageId }) => messageId === 'longString'),
)
console.log(
	'Classname lint rule: valid cases, rejection, auto-fix, and idempotence checks passed.',
)
