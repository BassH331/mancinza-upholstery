/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./App.tsx",
  "./main.tsx",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./styles/**/*.css"
],
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      border: '#e5e7eb',
      ring: '#cbd5e1',
    },
  },
},
plugins: [],
}
