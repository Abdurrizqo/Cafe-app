/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'Jost'],
      },
      colors: {
        'primary-color': '#fafafa',
        'secondary-color': '#CE5A67',
        'tertiary-color': '#ECECEC',
        'button-color': '#0571A7',
      },
    },
  },
  plugins: [],
};
