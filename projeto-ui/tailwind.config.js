/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1a73e8',
        'new-color': {
          50: '#f0f4f8',
          100: '#dae1e7',
          200: '#bfcbda',
          300: '#a3b4c9',
          400: '#879db8',
          500: '#6b86a7',
          600: '#526c8e',
          700: '#3a5376',
          800: '#263e5e',
          900: '#152945',
        }
      }
    },
  },
  plugins: [],
}
