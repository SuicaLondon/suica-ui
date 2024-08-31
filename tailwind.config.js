/** @type {import('tailwindcss').Config} */
module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					gray: '#1e2123',
					'gary-50': '#1e212350',
				},
			},
			boxShadow: {
				'slider-thumb': '0 0 0 4px #1e2123',
			},
			width: {
				iconSize: '1.375rem',
			},
			height: {
				iconSize: '1.375rem',
			},
			zIndex: {
				999: '999',
			},
			animation: {
				fadeOut: 'fadeOut 1s ease-in-out',
				scaleFadeOut: 'scaleFadeOut 1s forwards',
			},
			keyframes: () => ({
				fadeOut: {
					'0%': { opacity: 1 },
					'100%': { opacity: 0 },
				},
				scaleFadeOut: {
					'0%': { opacity: 1, transform: 'scale(1)' },
					'10%': { opacity: 1, transform: 'scale(1.1)' },
					'99%': { opacity: 0, transform: 'scale(1.5)' },
					'100%': { opacity: 0, transform: 'scale(1.5)', display: 'none' },
				},
			}),
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
