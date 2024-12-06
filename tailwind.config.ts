import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-readex-pro)'],
			},
		},
	},
} satisfies Config;
