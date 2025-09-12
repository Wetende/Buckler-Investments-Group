module.exports = {
  content: ["./src/**/*.{js,jsx}", "./src/**/**/*.{js,jsx}", "./src/**/**/**/*.{js,jsx}"],
  theme: {
    screens: {
      'xl': { 'max': '1600px' },
      'lg': { 'max': '1199px' },
      'md': { 'max': '991px' },
      'sm': { 'max': '767px' },
      'xs': { 'max': '575px' },
      'xxs': { 'max': '480px' },
      'mxl': { 'raw': '(min-width: 1921px)' },
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Poppins', 'sans-serif'],
    },
    fontSize: {
      base: ['15px', '30px'],
      xxs: ['11px', '14px'],
      xs: ['12px', '16px'],
      sm: ['13px', '22px'],
      md: ['14px', '20px'],
      xmd: ['16px', '28px'],
      lg: ['18px', '22px'],
      xlg: ['20px', '28px'],
      xbig: ['230px', '200px']
    },
    extend: {
      textUnderlineOffset: {
        2: '3px',
        4: '4px',
        8: '8px'
      },
      colors: {
        fastblue: '#0038e3',
        darkgray: '#232323',
        darkslateblue: '#1f232c',
        lightgray: '#f7f7f7',
        spanishgray: '#939393',
        mediumgray: '#e4e4e4',
        darkpurple2: '#241526',
        coolgray: '#d6d5d5',
        neonorange: '#ff7a56',
        slateblue: '#8890a4',
        error: 'red',
        // Brand Colors - Red Theme
        basecolor: '#dc2626',
        brandcolor: '#dc2626',
        primary: '#dc2626',
        'primary-red': '#dc2626',
        'red-hover': '#b91c1c',
        'red-light': '#f87171',
        'red-dark': '#991b1b',
        'red-50': '#fef2f2',
        'red-100': '#fee2e2',
        'red-200': '#fecaca',
        'red-300': '#fca5a5',
        'red-400': '#f87171',
        'red-500': '#ef4444',
        'red-600': '#dc2626',
        'red-700': '#b91c1c',
        'red-800': '#991b1b',
        'red-900': '#7f1d1d'
      }
    },
  },
  corePlugin: {
    order: false
  },
  plugins: [],
}