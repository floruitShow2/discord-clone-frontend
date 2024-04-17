/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,tsx}'],
  darkMode: ['selector', '[arco-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // background
        'primary': 'var(--color-bg-2)',
        // text
        'primary-label': 'var(--color-text-2)'
      }
    }
  },
  plugins: []
}

