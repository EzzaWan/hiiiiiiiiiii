/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff41',
          purple: '#bf00ff',
          pink: '#ff00ff',
          blue: '#00d9ff',
          yellow: '#ffff00',
        },
        cyber: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          darker: '#0d0d0d',
        }
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'terminal': ['"VT323"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'flicker': 'flicker 0.15s infinite',
        'scan': 'scan 8s linear infinite',
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '43.01%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-neon': {
          '0%, 100%': { 
            textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #00ff41, 0 0 80px #00ff41',
          },
          '50%': { 
            textShadow: '0 0 2px #fff, 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #00ff41, 0 0 40px #00ff41',
          },
        },
      },
    },
  },
  plugins: [],
}


