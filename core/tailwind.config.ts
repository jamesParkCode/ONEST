/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        text: {
          50: '#F3F8FF',
          100: '#ECF1FB',
          200: '#E2E7F1',
          300: '#D1D6E0',
          400: '#ADB2BB',
          500: '#8D929B',
          600: '#656A72',
          700: '#52565F',
          800: '#343840',
          900: '#14181F', //default
          DEFAULT: '#14181F'
        },
        success: {
          10: '#E8FCF0',
          20: '#C6E5D3',
          sub: '#419E6A',
          30: '#00632B',
        },
        error: {
          50: '#FFF5F6',
          100: '#FFE6E3',
          500: '#FF3A30',
          700: '#DE232A',
        },
        warning: {
          50: '#FCF8EF',
          300: '#E3AE4A',
          500: '#DA8E00',
        },
        primary: {
          50: '#E4F2FF',
          100: '#BFDDFF',
          400: '#51A2FF',
          600: '#4584FF',
          DEFAULT: '#4584FF',
          800: '#445ED7',
        },
        secondary: {
          DEFAULT: '#4D66A7'
        }
      }
    }
  },
  plugins: []
}
