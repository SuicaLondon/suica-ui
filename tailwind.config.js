/** @type {import('tailwindcss').Config} */
module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					dart: '#1e2123',
				},
			},
			boxShadow: {
				'slider-thumb': '0 0 0 4px #1e2123',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
