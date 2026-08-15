/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8FF',
        'on-background': '#171B2B',
        primary: '#884F44',
        'on-primary': '#FFFFFF',
        'primary-container': '#FFB5A7', // Peach
        'on-primary-container': '#7A443A',
        'primary-fixed': '#FFDAD3',
        'primary-fixed-dim': '#FEB4A6',
        secondary: '#4A654E',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#C9E7CA', // Matcha Mint
        'on-secondary-container': '#4E6952',
        'secondary-fixed': '#CCEACD',
        tertiary: '#675E3C',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#D4C79D', // Butter Yellow
        'on-tertiary-container': '#5C5332',
        'tertiary-fixed': '#F0E2B7',
        'tertiary-fixed-dim': '#D3C69D',
        lilac: '#E1BEE7',
        'lilac-container': '#DEE1F8', // Soft Lilac
        'on-lilac-container': '#3C3F5E',
        surface: '#FAF8FF',
        'surface-bright': '#FAF8FF',
        'surface-dim': '#D6D9EF',
        'surface-variant': '#DEE1F8',
        'on-surface': '#171B2B',
        'on-surface-variant': '#524341',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F3F2FF',
        'surface-container': '#EBEDFF',
        'surface-container-high': '#E4E7FE',
        'surface-container-highest': '#DEE1F8',
        'inverse-surface': '#2C3041',
        'inverse-on-surface': '#EFF0FF',
        outline: '#857370',
        'outline-variant': '#D7C2BE',
        error: '#BA1A1A',
        'error-container': '#FFDAD6',
        'on-error-container': '#93000A',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        sm: '0.5rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        base: '8px',
        sm: '12px',
        gutter: '16px',
        'margin-mobile': '20px',
        md: '24px',
        lg: '48px',
        xl: '64px',
        'margin-desktop': '120px',
      },
      boxShadow: {
        tactile: '4px 4px 0px 0px #171B2B',
        'tactile-sm': '2px 2px 0px 0px #171B2B',
        'tactile-lg': '6px 6px 0px 0px #171B2B',
        'tactile-modal': '8px 8px 0px 0px #171B2B',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1.5deg)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-1.5deg)' },
        },
        scan: {
          '0%': { top: '8%', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { top: '90%', opacity: '0' },
        },
        mascotBounce: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(-4deg)' },
          '50%': { transform: 'translateY(0) rotate(0deg)' },
          '75%': { transform: 'translateY(-4px) rotate(4deg)' },
        },
        tearRedeem: {
          '0%': { transform: 'scale(1)', filter: 'none' },
          '40%': { transform: 'scale(1.03) rotate(-1deg)', filter: 'brightness(1.1)' },
          '100%': { transform: 'scale(1)', filter: 'grayscale(0.4) opacity(0.85)' },
        }
      },
      animation: {
        'float-1': 'float1 5s ease-in-out infinite',
        'float-2': 'float2 6s ease-in-out infinite',
        'laser-scan': 'scan 2.2s infinite ease-in-out',
        'mascot-bounce': 'mascotBounce 2.5s infinite ease-in-out',
        'tear-redeem': 'tearRedeem 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
