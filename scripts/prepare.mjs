import { existsSync } from 'node:fs'

const packagingCommands = new Set(['pack', 'publish'])
const shouldInstallHooks =
	process.env.HUSKY !== '0' &&
	process.env.CI !== 'true' &&
	process.env.NODE_ENV !== 'production' &&
	!packagingCommands.has(process.env.npm_command ?? '') &&
	existsSync('.git') &&
	existsSync('node_modules/husky')

if (shouldInstallHooks) {
	const { default: husky } = await import('husky')
	husky()
}
