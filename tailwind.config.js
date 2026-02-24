/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#f4e4c1',
        'parchment-dark': '#c4a882',
        'parchment-light': '#faf3e6',
        'war-navy': '#141e30',
        'war-navy-light': '#1c2b42',
        'war-red': '#8b1a1a',
        'war-gold': '#c9a227',
        'war-copper': '#b87333',
        'war-brass': '#d4a947',
        'war-green': '#2d5a27',
        'war-ink': '#1a1a14',
        'british-red': '#c41e3a',
        'us-blue': '#1a3a6e',
        'native-brown': '#8b5e3c',
        'lantern': '#f5d89a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Crimson Text"', 'Georgia', 'serif'],
        serif: ['"IM Fell English"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'lantern': '0 0 40px rgba(245, 216, 154, 0.08), 0 0 80px rgba(201, 162, 39, 0.04)',
        'copper': '0 2px 8px rgba(184, 115, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 162, 39, 0.15)',
        'modal': '0 8px 48px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(201, 162, 39, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'candleflicker': 'candleflicker 4s ease-in-out infinite',
        'fadein': 'fadein 0.4s ease-out',
        'slideup': 'slideup 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        candleflicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        fadein: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideup: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
