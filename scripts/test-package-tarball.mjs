import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const npmCache = await mkdtemp(join(tmpdir(), 'suica-ui-npm-cache-'))
const environment = {
	...process.env,
	HUSKY: '0',
	npm_config_cache: npmCache,
}
let output

try {
	output = execFileSync(
		'npm',
		['pack', '--dry-run', '--json', '--ignore-scripts'],
		{ encoding: 'utf8', env: environment },
	)
} finally {
	await rm(npmCache, { recursive: true, force: true })
}
const [packResult] = JSON.parse(output)
const packedFiles = new Set(packResult.files.map(({ path }) => path))
const packageJson = JSON.parse(await readFile('package.json', 'utf8'))

for (const [subpath, target] of Object.entries(packageJson.exports)) {
	const targets = typeof target === 'string' ? [target] : Object.values(target)

	for (const exportTarget of targets) {
		const packedPath = exportTarget.replace(/^\.\//u, '')
		if (!packedFiles.has(packedPath)) {
			throw new Error(
				`Package export ${subpath} is missing from the tarball: ${packedPath}`,
			)
		}
	}
}
