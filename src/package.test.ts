import { readFile } from 'node:fs/promises'

describe('published package compatibility', () => {
	it('does not require Tailwind when consumers use the precompiled stylesheet', async () => {
		const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
			peerDependencies?: Record<string, string>
		}

		expect(packageJson.peerDependencies).not.toHaveProperty('tailwindcss')
	})
})
