/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#008080',
        secondary: '#1A237E',
        accent: '#FF6D00',
        background: '#FAFAFA',
        surface: '#F0F0F0',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        success: '#43A047',
        error: '#E53935',
        'dark-bg': '#121212',
        'dark-text': '#EEEEEE',
      },
      fontFamily: {
        'logo': ['Montserrat', 'sans-serif'],
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #008080, #1A237E)',
      },
    },
  },
  plugins: [],
}