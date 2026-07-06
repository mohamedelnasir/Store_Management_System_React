/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F6F1',
          dim: '#ECEEE7',
        },
        ink: {
          DEFAULT: '#16231F',
          soft: '#3A4A44',
          faint: '#6B7A73',
        },
        register: {
          50: '#EAF3EF',
          100: '#CFE4DA',
          400: '#2F8266',
          500: '#1F6F54',
          600: '#175943',
          700: '#114233',
        },
        amber: {
          50: '#FBF1E1',
          400: '#D89A3E',
          500: '#C68A2E',
          600: '#A16F22',
        },
        brick: {
          50: '#F7E9E5',
          400: '#C6604A',
          500: '#B3432E',
          600: '#8F3323',
        },
        slate: {
          50: '#F1F2F0',
          200: '#DADDD7',
          400: '#8B958F',
          500: '#6B7A73',
          600: '#4E5C56',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 35, 31, 0.06)',
      },
    },
  },
  plugins: [],
}
