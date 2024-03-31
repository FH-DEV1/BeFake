import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255, 255, 255, 0.35)",
          "0 0px 65px rgba(255, 255, 255, 0.2)"
        ],
        darkGlow: [
          "0 0px 20px rgba(0, 0, 0, 0.7)",
          "0 0px 65px rgba(0, 0, 0, 0.4)"
        ]
      }
    }
  },
  plugins: [],
}
export default config