/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': { 'max': '639px' },

      'md': { 'max': '767px' },

      'lg': { 'max': '1023px' },

      'xl': { 'max': '1279px' },
    },
    fontFamily: {
      'sans': ['Ubuntu', 'Sans-serif']
    },
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'custom': '20px', // تحديد قيمة الحدود المستديرة المخصصة هنا
      },
      colors: {
        'backGraound': '#f8f9fa',
        'minueBg': '#fff',
        'minueListBg': 'transparent',
        'minueColor': 'rgba(47, 43, 61, 0.68)',
        'munueHover': 'rgba(47, 43, 61, 0.04)',
        'minueActiveGraideint': {
          100: 'rgb(115, 103, 240)',
          70: 'rgba(115, 103, 240, 0.7)',
        },
        secondary: '#f59e0b',

      },
    },
  },
  plugins: [

  ],
}
