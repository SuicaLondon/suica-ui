import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [tailwindcss()],
	publicDir: false,
	build: {
		lib: {
			entry: fileURLToPath(new URL('./src/vite-entry.ts', import.meta.url)),
			formats: ['es'],
			fileName: 'index',
			cssFileName: 'styles',
		},
		rollupOptions: {
			external: [
				/^react(?:\/.*)?$/,
				/^react-dom(?:\/.*)?$/,
				/^clsx$/,
				/^tailwind-merge$/,
			],
			output: {
				banner: '"use client";',
			},
		},
		sourcemap: true,
	},
})
