import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'

const clientEntries = [
	'dist/date-picker/index.js',
	'dist/index.js',
	'dist/dialog/index.js',
	'dist/dropdown-menu/index.js',
	'dist/nested-scroll-view/index.js',
	'dist/sidebar/index.js',
	'dist/table/table-control.js',
	'dist/tabs/index.js',
]

const expectedClientModules = new Set([
	'dist/internal/use-controllable-boolean.js',
	'dist/internal/use-hydrated.js',
	'dist/date-picker/date-picker.js',
	'dist/dialog/dialog.js',
	'dist/dialog/dialog-close.js',
	'dist/dialog/dialog-content.js',
	'dist/dialog/dialog-context.js',
	'dist/dialog/dialog-description.js',
	'dist/dialog/dialog-title.js',
	'dist/dialog/dialog-trigger.js',
	'dist/dropdown-menu/dropdown-menu-content.js',
	'dist/dropdown-menu/dropdown-menu-item.js',
	'dist/dropdown-menu/dropdown-menu-link.js',
	'dist/dropdown-menu/dropdown-menu-trigger.js',
	'dist/dropdown-menu/dropdown-menu.js',
	'dist/nested-scroll-view/nested-scroll-view.js',
	'dist/sidebar/sidebar-button/index.js',
	'dist/sidebar/sidebar.js',
	'dist/sidebar/use-responsive-sidebar.js',
	'dist/slider-checkbox/slider-checkbox.js',
	'dist/table/table-control.js',
	'dist/tabs/tabs.js',
])

const serverEntries = [
	'dist/separator/index.js',
	'dist/alert/index.js',
	'dist/badge/index.js',
	'dist/button/index.js',
	'dist/card/index.js',
	'dist/checkbox/index.js',
	'dist/field/index.js',
	'dist/input/index.js',
	'dist/label/index.js',
	'dist/loading-indicator/index.js',
	'dist/overlay/index.js',
	'dist/section-heading/index.js',
	'dist/scalable-tag/index.js',
	'dist/select/index.js',
	'dist/skeleton/index.js',
	'dist/spinner/index.js',
	'dist/table/index.js',
	'dist/textarea/index.js',
]

const clientDirectivePattern = /^['"]use client['"];/u
const unsafeReactApiPattern = /\b(?:useState|useEffect|useLayoutEffect)\b/u
const browserGlobalPattern = /\b(?:window|document|navigator)\s*[.[]/u
const relativeImportPattern = /(?:\bfrom\s*|\bimport\s*)['"](\.[^'"]+)['"]/gu

async function readJavaScriptGraph(entry) {
	const files = new Map()
	const pending = [resolve(entry)]

	while (pending.length > 0) {
		const file = pending.pop()
		if (!file || files.has(file)) continue
		const source = await readFile(file, 'utf8')
		files.set(file, source)

		for (const match of source.matchAll(relativeImportPattern)) {
			const specifier = match[1]
			if (!specifier?.endsWith('.js')) continue
			pending.push(resolve(dirname(file), specifier))
		}
	}

	return files
}

async function listJavaScriptFiles(directory) {
	const files = []
	const entries = await readdir(directory, { withFileTypes: true })

	for (const entry of entries) {
		const path = resolve(directory, entry.name)
		if (entry.isDirectory()) files.push(...(await listJavaScriptFiles(path)))
		if (entry.isFile() && entry.name.endsWith('.js')) files.push(path)
	}

	return files
}

for (const entry of clientEntries) {
	const graph = await readJavaScriptGraph(entry)
	if (
		![...graph.values()].some((source) => clientDirectivePattern.test(source))
	) {
		throw new Error(`${entry} must export at least one Client Component`)
	}
}

const rootSource = await readFile('dist/index.js', 'utf8')
if (clientDirectivePattern.test(rootSource)) {
	throw new Error(
		'dist/index.js must not force every root export into the client',
	)
}

const actualClientModules = new Set()
for (const file of await listJavaScriptFiles('dist')) {
	const source = await readFile(file, 'utf8')
	if (clientDirectivePattern.test(source)) {
		actualClientModules.add(relative(process.cwd(), file))
	}
}

for (const file of expectedClientModules) {
	if (!actualClientModules.has(file)) {
		throw new Error(`${file} must be a Client Component boundary`)
	}
}

for (const file of actualClientModules) {
	if (!expectedClientModules.has(file)) {
		throw new Error(`${file} has an unnecessary Client Component directive`)
	}
}

for (const entry of serverEntries) {
	const graph = await readJavaScriptGraph(entry)
	for (const [file, source] of graph) {
		if (clientDirectivePattern.test(source)) {
			throw new Error(`${entry} transitively imports client module ${file}`)
		}
		if (unsafeReactApiPattern.test(source)) {
			throw new Error(
				`${entry} transitively imports a client React API from ${file}`,
			)
		}
		if (browserGlobalPattern.test(source)) {
			throw new Error(`${entry} transitively uses a browser global in ${file}`)
		}
	}
}

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
for (const [subpath, target] of Object.entries(packageJson.exports)) {
	const paths = typeof target === 'string' ? [target] : Object.values(target)
	for (const path of paths) {
		try {
			await access(path)
		} catch {
			throw new Error(`Package export ${subpath} points to missing file ${path}`)
		}
	}
}
