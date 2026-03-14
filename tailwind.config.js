/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f7',
          100: '#fbe9f0',
          200: '#f7d2e0',
          300: '#f1adca',
          400: '#d9447e', // Vibrant Plum - Improved
          500: '#b8205a', // Primary Vibrant Plum
          600: '#9b1b4b',
          700: '#7d163d',
          800: '#5e102e',
          900: '#400a1f',
        },
        tech: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          emerald: '#10b881',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
        surface: {
          50: '#ffffff',
          100: '#f9fafb',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#d1d5db',
          500: '#c2c8d2', 
          700: '#f1f5f9',
          800: '#ffffff',
          900: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px -3px rgba(184, 32, 90, 0.2)',
        'glow-lg': '0 0 30px -5px rgba(184, 32, 90, 0.3)',
        'glow-plum': '0 0 20px -5px rgba(184, 32, 90, 0.4)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(184, 32, 90, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(184, 32, 90, 0.4)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
