/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // МЫ ДОБАВИЛИ ЭТУ СТРОКУ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        // Теперь ты сможешь использовать font-display
        display: ['"Archivo Black"', 'sans-serif'],
      },
    },
  },
}