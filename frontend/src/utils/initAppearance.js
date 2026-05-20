/**
 * Initializes user appearance preferences (theme, font size)
 * from localStorage on app startup. Call this once in main.jsx.
 *
 * This ensures preferences persist across page reloads and are applied
 * before the Settings page is even visited.
 */

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

    // 2) Font size
    const fontSizeId = localStorage.getItem('frolic_fontsize') || 'medium'
    root.style.fontSize = FONT_SIZE_MAP[fontSizeId] || '16px'
}
