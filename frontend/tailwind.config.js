/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0B0F1A', 50: '#1a2035', 100: '#141929', 200: '#0f1525', 300: '#0B0F1A' },
        blue:    { DEFAULT: '#2563EB', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
        magenta: { DEFAULT: '#D946EF', 400: '#E879F9', 500: '#D946EF', 600: '#C026D3' },
        violet:  { DEFAULT: '#7C3AED', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-hero':  'linear-gradient(135deg, #0B0F1A 0%, #0f1530 40%, #1a0a2e 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)',
        'gradient-btn':   'linear-gradient(135deg, #2563EB, #7C3AED)',
        'gradient-badge': 'linear-gradient(135deg, #D946EF, #7C3AED)',
      },
      boxShadow: {
        'glow-blue':    '0 0 30px rgba(37,99,235,0.3)',
        'glow-violet':  '0 0 30px rgba(124,58,237,0.3)',
        'glow-magenta': '0 0 20px rgba(217,70,239,0.25)',
        'card':         '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
