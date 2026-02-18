/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f4e4c1',
        'parchment-dark': '#d4c4a1',
        'war-navy': '#1a2744',
        'war-red': '#8b1a1a',
        'war-gold': '#c9a227',
        'war-green': '#2d5a27',
        'british-red': '#c41e3a',
        'us-blue': '#002868',
        'native-brown': '#8b5e3c',
      },
      fontFamily: {
        serif: ['"IM Fell English"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
