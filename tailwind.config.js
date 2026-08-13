/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Keeping teal for now as secondary
          600: '#0d9488',
          900: '#134e4a',
          950: '#042f2e'
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68',
          700: '#243b53',
          800: '#102a43', // Deep Navy
          900: '#0a192f', // Very Deep Navy
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          accent: '#d4af37', // Metallic Gold
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: [],
}
