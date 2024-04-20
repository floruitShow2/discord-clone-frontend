/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,tsx}'],
  darkMode: ['selector', '[arco-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // background
        'primary': 'var(--color-bg-2)',
        'module': 'var(--color-fill-2)',
        'module-2': 'var(--color-fill-3)',
        // text
        'primary-l': 'var(--color-text-2)',
        'light-l': 'var(--color-text-3)',
        'heavy-l': 'var(--color-text-1)',
        // border
        'primary-b': 'rgb(var(--gray-2))'
      }
    }
  },
  plugins: []
}

