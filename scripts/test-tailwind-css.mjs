import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'

// Compile from a consumer directory, not the repository's source discovery root.
const consumer = await mkdtemp(path.join(tmpdir(), 'suica-css-consumer-'))
const packageRoot = path.resolve('.')
function declarations(root, selector, property) {
	const values = []
	root.walkRules((rule) => {
		if (rule.selectors.includes(selector))
			rule.walkDecls(property, (declaration) => values.push(declaration.value))
	})
	return values
}
function assertCompiled(root) {
	root.walkAtRules((rule) =>
		assert.ok(
			!['theme', 'utility', 'apply', 'source', 'import'].includes(rule.name),
			`Uncompiled directive: @${rule.name}`,
		),
	)
}
try {
	await cp(
		'test/tailwind-consumer/fixture.tsx',
		path.join(consumer, 'fixture.tsx'),
	)
	const entry = path.join(consumer, 'app.css')
	// An application can override public theme tokens and generate variants of shared utilities.
	await writeFile(
		entry,
		`@import '${path.join(packageRoot, 'tailwind.css')}';\n@theme inline { --color-accent: #123456; }\n`,
	)
	const result = await postcss([tailwindcss({ base: consumer })]).process(
		await readFile(entry, 'utf8'),
		{ from: entry },
	)
	assertCompiled(result.root)
	for (const [selector, property] of [
		['.size-13', 'width'],
		['.px-7', 'padding-inline'],
	]) {
		assert.ok(
			declarations(result.root, selector, property).length,
			`Missing consumer utility: ${selector}`,
		)
	}
	assert.deepEqual(
		declarations(result.root, '.bg-accent', 'background-color'),
		['#123456'],
		'Consumer theme overrides must produce one effective utility definition',
	)
	let responsiveUtility = false
	result.root.walkRules('.md\\:menu-viewport', (rule) => {
		let parent = rule.parent
		while (parent && parent.type !== 'atrule') parent = parent.parent
		if (parent?.name === 'media') responsiveUtility = true
	})
	assert.ok(
		responsiveUtility,
		'Consumer variants must work with shared custom utilities',
	)
	const standalone = postcss.parse(await readFile('dist/styles.css', 'utf8'))
	assertCompiled(standalone)
	assert.ok(
		declarations(standalone, '.bg-accent', 'background-color').length,
		'Precompiled CSS must include component utilities without a consumer build',
	)
	for (const [selector, property, expected] of [
		['.text-badge-sm', 'font-size', '0.6875rem'],
		['.tracking-tag', 'letter-spacing', '-0.03em'],
		['.tag-prefix-offset', 'margin-top', '0.22em'],
		['.tag-count-offset', 'margin-top', '0.05em'],
		['.font-inherit', 'font', 'inherit'],
		['.transition-control', 'transition-property', 'border-color, box-shadow'],
		['.transition-scroll-position', 'transition-property', 'top, height'],
		['.transition-stroke-offset', 'transition-property', 'stroke-dashoffset'],
	]) {
		const values = declarations(standalone, selector, property)
		assert.ok(
			values.some(
				(value) =>
					value.replace(/\s+/gu, '').replace(/(^|[^\d])0\./gu, '$1.') ===
					expected.replace(/\s+/gu, '').replace(/(^|[^\d])0\./gu, '$1.'),
			),
			`${selector} must preserve ${property}: ${expected}; got ${values}`,
		)
	}
	console.log(
		'CSS entries: isolated consumer compilation, theme overrides, utility variants, and standalone output passed.',
	)
} finally {
	await rm(consumer, { recursive: true, force: true })
}
