import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		extend:{
			colors: {
      		  primary: {
      		    DEFAULT: 'var(--color-primary)',
				darkbg: 'var(--color-primary-darkbg)',
				whitebg: 'var(--color-primary-whitebg)',
      		    hover: 'var(--color-primary-hover)',
				border:'var(--color-primary-border)',
      		  },
			  secondary: {
				DEFAULT: 'var(--color-secondary)',
				darkbg: 'var(--color-secondary-darkbg)',
				whitebg: 'var(--color-secondary-whitebg)',
				hover: 'var(--color-secondary-hover)',
				border:'var(--color-secondary-border)',
			 },
      		  surface: {
      		    main: 'var(--color-surface-main)',
      		    child: 'var(--color-surface-child)',
      		  },
      		  accent: 'var(--color-accent)',
      		  danger: {
				DEFAULT: 'var(--color-danger)',
				hover: 'var(--color-hover)'
			  }, 
				
      		},
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
	},
	plugins: [
    
  ],
} satisfies Config;
