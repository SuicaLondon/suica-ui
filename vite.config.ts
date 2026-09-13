import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [tailwindcss()],
	publicDir: false,
	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/styles-entry.ts', import.meta.url)),
			formats: ['es'],
			fileName: 'styles-export',
			cssFileName: 'styles',
		},
	},
})
