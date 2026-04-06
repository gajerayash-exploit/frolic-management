/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary gradient colors
                primary: {
                    50: '#f0f5ff',
                    100: '#e0ebff',
                    200: '#c2d6ff',
                    300: '#94b8ff',
                    400: '#5c8fff',
                    500: '#3b6bff',
                    600: '#1e45f5',
                    700: '#1633e0',
                    800: '#182bb6',
                    900: '#1a2a8f',
                    950: '#0f1557',
                },
                // Neon purple accent
                accent: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7c22ce',
                    800: '#6821a9',
                    900: '#551c87',
                    950: '#3b0764',
                },
                // Deep midnight
                midnight: {
                    50: '#f4f6fb',
                    100: '#e8ecf6',
                    200: '#ccd7ec',
                    300: '#9fb5db',
                    400: '#6b8ec6',
                    500: '#4870b0',
                    600: '#375894',
                    700: '#2e4778',
                    800: '#293d64',
                    900: '#263554',
                    950: '#0f172a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-purple-blue': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                'gradient-midnight': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
                'gradient-sunset': 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient': 'gradient 8s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-sm': '0 0 15px rgba(139, 92, 246, 0.3)',
                'glow': '0 0 30px rgba(139, 92, 246, 0.4)',
                'glow-lg': '0 0 60px rgba(139, 92, 246, 0.5)',
                'glow-purple': '0 0 30px rgba(168, 85, 247, 0.4)',
                'glow-blue': '0 0 30px rgba(59, 130, 246, 0.4)',
                'inner-glow': 'inset 0 0 30px rgba(139, 92, 246, 0.2)',
            },
        },
    },
    plugins: [],
}
