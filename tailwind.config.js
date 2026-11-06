export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // The calm design (2026-11): warm paper, lapis ink, turquoise and a
        // little gold — Persian tile and manuscript colours, kept quiet. The
        // names stay (space = surfaces, ink = text) so every page follows.
        space: {
          0: '#fbf9f5', // the page
          1: '#f4f0e8', // a section set apart
          2: '#ffffff', // cards
          3: '#ece6da', // a raised or pressed surface
        },
        line: 'rgba(23, 35, 62, 0.12)',
        blue: {
          DEFAULT: '#1f4fa8', // lapis: the one colour of action
          soft: '#2d62c4',
          deep: '#173d85',
        },
        cyan: {
          DEFAULT: '#0f7c86', // turquoise, dark enough for text on paper
          soft: '#0d6d76',
        },
        violet: {
          DEFAULT: '#5a4bb0',
          soft: '#4a3d99',
        },
        gold: {
          DEFAULT: '#a87a22',
        },
        ink: {
          DEFAULT: '#17233e', // headings and body
          muted: '#3f4b66',
          faint: '#5f6a82',
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
