/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // off-black
        panel: '#121214',      // charcoal panel
        surface: '#18181b',    // light-charcoal surface
        border: '#27272a',     // soft border gray
        'border-focus': '#3f3f46',
        primary: {
          DEFAULT: '#fafafa',  // warm white
          muted: '#a1a1aa',    // soft gray
        },
        traffic: {
          red: '#ef4444',      // refined crimson
          yellow: '#f59e0b',   // refined amber
          green: '#10b981',    // refined emerald
        },
        brand: {
          blue: '#3b82f6',
          purple: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Satoshi', 'General Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'subtle-glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'inset-card': 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'noise': "url('/noise.png')",
      }
    },
  },
  plugins: [],
};
