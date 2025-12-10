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
                "primary": "#4A90E2",
                "primary-dark": "#357ABD",
                "background-light": "#f8f9fa",
                "background-dark": "#0f172a", // Slightly richer dark blue
                "card-light": "#ffffff",
                "card-dark": "#1e293b", // Slate-800 for better visibility
                "border-light": "#e2e8f0",
                "border-dark": "#334155",
                "text-primary-light": "#1e293b",
                "text-primary-dark": "#f8fafc", // White-ish
                "text-secondary-light": "#64748b",
                "text-secondary-dark": "#94a3b8", // Slate-400 (much lighter than previous)
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Inter", "sans-serif"]
            },
            animation: {
                "blob": "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
