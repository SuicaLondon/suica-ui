import { readFile } from 'node:fs/promises'

const bundle = await readFile('dist/index.js', 'utf8')

if (!/^['"]use client['"];/u.test(bundle)) {
	throw new Error(
		'The public JavaScript bundle must preserve a Next.js Client Component boundary',
	)
}
