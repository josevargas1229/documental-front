/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx,vue}', // ajusta la ruta a tu estructura
    './public/index.html',
  ],
  theme: {
    extend: {
  colors: {
    brand: {
      primary: "#7A1F2F",   // Guinda institucional
      secondary: "#D4AF37", // Oro
      blue: "#2E6EDC",      // Azul institucional para carpetas
      graySoft: "#F5F6FA",  // Fondo suave
      grayBorder: "#E4E6EB"
    }
  },
  boxShadow: {
    card: "0 2px 4px rgba(0,0,0,0.08)"
  }
}
  },
  plugins: [],
}

