/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path and extensions according to your project structure
    "./public/index.html" // Include HTML files if you use Tailwind classes in plain HTML
  ],
  theme: { 
    extend: { 
        fontFamily: { 
            "ultra": ['Ultra', 'serif'] 
        } 
    }, 
  }, 
  plugins: []
}

