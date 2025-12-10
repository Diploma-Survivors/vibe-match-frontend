import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'clamp(1rem, 5vw, 2rem)', // Fluid padding
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        // Fluid Typography: Mobile (min) -> Desktop (max)
        xs: 'clamp(0.75rem, 0.70rem + 0.25vw, 0.875rem)',
        sm: 'clamp(0.875rem, 0.84rem + 0.18vw, 1rem)',
        base: 'clamp(1rem, 0.96rem + 0.22vw, 1.125rem)',
        lg: 'clamp(1.125rem, 1.08rem + 0.22vw, 1.25rem)',
        xl: 'clamp(1.25rem, 1.16rem + 0.45vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.32rem + 0.9vw, 2rem)',
        '3xl': 'clamp(1.875rem, 1.65rem + 1.12vw, 2.5rem)',
        '4xl': 'clamp(2.25rem, 1.98rem + 1.35vw, 3rem)',
        '5xl': 'clamp(3rem, 2.64rem + 1.8vw, 4rem)',
        '6xl': 'clamp(3.75rem, 3.3rem + 2.25vw, 5rem)',
        '7xl': 'clamp(4.5rem, 3.96rem + 2.7vw, 6rem)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
