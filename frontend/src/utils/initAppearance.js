/**
 * Initializes user appearance preferences (theme, accent, font size)
 * from localStorage on app startup. Call this once in main.jsx.
 *
 * This ensures preferences persist across page reloads and are applied
 * before the Settings page is even visited.
 */

const ACCENT_HSL_MAP = {
    purple:  { hsl: '270, 70%, 60%', glow: '270, 70%, 50%' },
    blue:    { hsl: '217, 91%, 60%', glow: '217, 91%, 50%' },
    cyan:    { hsl: '188, 86%, 53%', glow: '188, 86%, 43%' },
    emerald: { hsl: '160, 84%, 39%', glow: '160, 84%, 30%' },
    rose:    { hsl: '350, 89%, 60%', glow: '350, 89%, 50%' },
    amber:   { hsl: '38, 92%, 50%',  glow: '38, 92%, 40%' },
}

const FONT_SIZE_MAP = {
    small:  '14px',
    medium: '16px',
    large:  '18px',
}

export function initAppearance() {
    const root = document.documentElement

    // 1) Theme
    const theme = localStorage.getItem('frolic_theme') || 'dark'
    root.classList.remove('theme-dark', 'theme-light')
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.add(prefersDark ? 'theme-dark' : 'theme-light')
    } else {
        root.classList.add(`theme-${theme}`)
    }

    // 2) Accent color
    const accentId = localStorage.getItem('frolic_accent') || 'purple'
    const accent = ACCENT_HSL_MAP[accentId] || ACCENT_HSL_MAP.purple
    root.style.setProperty('--accent-color', `hsl(${accent.hsl})`)
    root.style.setProperty('--accent-glow', `hsl(${accent.glow})`)
    root.style.setProperty('--accent-hsl', accent.hsl)

    // 3) Font size
    const fontSizeId = localStorage.getItem('frolic_fontsize') || 'medium'
    root.style.fontSize = FONT_SIZE_MAP[fontSizeId] || '16px'
}
