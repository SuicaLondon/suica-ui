import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

async function listSourceFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true })
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(directory, entry.name)
			if (entry.isDirectory()) return listSourceFiles(entryPath)
			return [entryPath]
		}),
	)

	return files.flat()
}

describe('Suica theme styles', () => {
	it('contains only Tailwind setup and semantic theme state', async () => {
		const css = await readFile('src/styles.css', 'utf8')

		expect(css).toContain('--sui-theme-surface: #f3f4ef')
		expect(css).toContain('--sui-theme-accent: #007a3b')
		expect(css).toContain('--sui-theme-danger: #b42318')
		expect(css).toContain('--sui-theme-warning: #8a5a00')
		expect(css).toContain('--sui-theme-success: #007a3b')
		expect(css).toContain('--sui-theme-control-line: rgb(20 24 20 / 18%)')
		expect(css).toContain(
			'--animate-skeleton-shimmer: sui-skeleton-shimmer 1.4s linear infinite',
		)
		expect(css).toContain('@keyframes sui-skeleton-shimmer')
		expect(css).toContain('background-position: -200% 0')
		expect(css).toContain('--radius-control: 6px')
		expect(css).toContain('--radius-panel: 12px')
		expect(css).toContain('--sui-theme-color-scheme: light')
		expect(css).toContain("[data-theme='dark']")
		expect(css).toContain('--sui-theme-accent: #18a957')
		expect(css).toContain('--sui-theme-danger: #ff7b72')
		expect(css).toContain('--sui-theme-control-line: rgb(242 244 240 / 20%)')
		expect(css).toContain('--sui-theme-color-scheme: dark')
		expect(css).not.toContain('@layer components')
		expect(css).not.toContain('@utility')
		expect(css).not.toMatch(/\.sui-(?:sidebar|tabs|discrete-slider)/)
	})

	it('explicitly scans every production module that contains utilities', async () => {
		const css = await readFile('src/styles.css', 'utf8')
		const sourceFiles = await listSourceFiles('src')
		const productionFiles = sourceFiles.filter(
			(file) =>
				/\.tsx?$/.test(file) &&
				!file.endsWith('.stories.tsx') &&
				!file.endsWith('.test.ts') &&
				!file.endsWith('.test.tsx') &&
				!file.includes(`${path.sep}test${path.sep}`),
		)

		for (const file of productionFiles) {
			const source = await readFile(file, 'utf8')
			if (!source.includes('sui:')) continue

			const relativePath = path.relative('src', file).split(path.sep).join('/')
			expect(css, `Missing Tailwind source for ${relativePath}`).toContain(
				`@source './${relativePath}';`,
			)
		}
	})

	it('uses semantic theme tokens instead of ancestor-sensitive dark utilities', async () => {
		const sourceFiles = await listSourceFiles('src')
		const productionFiles = sourceFiles.filter(
			(file) =>
				/\.tsx?$/.test(file) &&
				!file.endsWith('.stories.tsx') &&
				!file.endsWith('.test.ts') &&
				!file.endsWith('.test.tsx') &&
				!file.includes(`${path.sep}test${path.sep}`),
		)

		for (const file of productionFiles) {
			const source = await readFile(file, 'utf8')
			expect(source, file).not.toContain('sui:dark:')
		}
	})
})
