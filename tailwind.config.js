export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // "A Persian night" (2026-11): a deep lapis night sky, ivory text, a
        // turquoise of tilework for links and small headings, gold for the
        // few things that should shine. Every text pair meets WCAG AA on the
        // night (ink ≈ 15:1, muted ≈ 9:1, faint ≈ 5.5:1). The names stay
        // (space = surfaces, ink = text) so every page follows.
        space: {
          0: '#0a1026', // the night
          1: '#0e1630', // a section set apart
          2: '#131d3c', // cards
          3: '#1b2850', // raised
        },
        line: 'rgba(186, 204, 255, 0.13)',
        blue: {
          DEFAULT: '#3a66e0', // lapis: the one colour of action (white on it ≈ 5:1)
          soft: '#4f7af0',
          deep: '#2a4fb8',
        },
        cyan: {
          DEFAULT: '#5fd4cf', // turquoise tile
          soft: '#8fe4e0',
        },
        violet: {
          DEFAULT: '#a596ff',
          soft: '#c1b6ff',
        },
        gold: {
          DEFAULT: '#e4bc62',
        },
        ink: {
          DEFAULT: '#eef2fb',
          muted: '#b8c3de',
          faint: '#8e9cc0',
        },
      },
      fontFamily: {
        // Vazirmatn after each Latin face: Persian words on an English page
        // (the company name, a person's name) are drawn in it, not a system font.
        display: ['"Inter Tight Variable"', '"Inter Tight"', '"Vazirmatn Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', '"Vazirmatn Variable"', 'system-ui', 'sans-serif'],
        // Small labels were set in a typewriter face; they read as machine
        // output. The same faces as the text now.
        mono: ['"Inter Variable"', 'Inter', '"Vazirmatn Variable"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.04em',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      maxWidth: {
        shell: '1400px',
      },
      transitionTimingFunction: {
        sim: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
}
