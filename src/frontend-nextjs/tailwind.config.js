import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4ab973',
                secondary: '#f3f3f3',
            },
        },
    },
    darkMode: 'class',
    plugins: [heroui()],
};

module.exports = config;
