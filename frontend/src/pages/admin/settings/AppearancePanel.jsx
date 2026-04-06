import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineDesktopComputer,
    HiOutlineCheck
} from 'react-icons/hi'
import SettingSection from './components/SettingSection'

const THEMES = [
    { id: 'dark',  icon: HiOutlineMoon,           label: 'Dark Mode',  desc: 'Easy on the eyes' },
    { id: 'light', icon: HiOutlineSun,             label: 'Light Mode', desc: 'Classic bright UI' },
    { id: 'auto',  icon: HiOutlineDesktopComputer, label: 'System',     desc: 'Match OS setting' },
]

const ACCENTS = [
    { id: 'purple',  color: 'bg-purple-500',  ring: 'ring-purple-400',  hsl: '270, 70%, 60%',  hslGlow: '270, 70%, 50%' },
    { id: 'blue',    color: 'bg-blue-500',    ring: 'ring-blue-400',    hsl: '217, 91%, 60%',  hslGlow: '217, 91%, 50%' },
    { id: 'cyan',    color: 'bg-cyan-500',    ring: 'ring-cyan-400',    hsl: '188, 86%, 53%',  hslGlow: '188, 86%, 43%' },
    { id: 'emerald', color: 'bg-emerald-500', ring: 'ring-emerald-400', hsl: '160, 84%, 39%',  hslGlow: '160, 84%, 30%' },
    { id: 'rose',    color: 'bg-rose-500',    ring: 'ring-rose-400',    hsl: '350, 89%, 60%',  hslGlow: '350, 89%, 50%' },
    { id: 'amber',   color: 'bg-amber-500',   ring: 'ring-amber-400',  hsl: '38, 92%, 50%',   hslGlow: '38, 92%, 40%' },
]

const FONT_SIZES = [
    { id: 'small',  label: 'Small',  px: '14px', sampleClass: 'text-xs' },
    { id: 'medium', label: 'Medium', px: '16px', sampleClass: 'text-sm' },
    { id: 'large',  label: 'Large',  px: '18px', sampleClass: 'text-base' },
]

// ─── Apply accent color as CSS custom properties on :root ────────
function applyAccent(accentId) {
    const accent = ACCENTS.find(a => a.id === accentId) || ACCENTS[0]
    const root = document.documentElement
    root.style.setProperty('--accent-color', `hsl(${accent.hsl})`)
    root.style.setProperty('--accent-glow', `hsl(${accent.hslGlow})`)
    root.style.setProperty('--accent-hsl', accent.hsl)
}

// ─── Apply font size to <html> element ───────────────────────────
function applyFontSize(sizeId) {
    const size = FONT_SIZES.find(s => s.id === sizeId) || FONT_SIZES[1]
    document.documentElement.style.fontSize = size.px
}

// ─── Apply theme class on <html> ─────────────────────────────────
function applyTheme(themeId) {
    const root = document.documentElement

    // Remove old theme classes
    root.classList.remove('theme-dark', 'theme-light')

    if (themeId === 'auto') {
        // Follow OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.add(prefersDark ? 'theme-dark' : 'theme-light')
    } else {
        root.classList.add(`theme-${themeId}`)
    }
}

// ═════════════════════════════════════════════════════════════════
export default function AppearancePanel() {
    const [theme, setTheme] = useState(() => localStorage.getItem('frolic_theme') || 'dark')
    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('frolic_accent') || 'purple')
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('frolic_fontsize') || 'medium')
    const [showSaved, setShowSaved] = useState('')

    // Apply theme on change
    useEffect(() => {
        localStorage.setItem('frolic_theme', theme)
        applyTheme(theme)
    }, [theme])

    // Apply accent on change
    useEffect(() => {
        localStorage.setItem('frolic_accent', accentColor)
        applyAccent(accentColor)
    }, [accentColor])

    // Apply font size on change
    useEffect(() => {
        localStorage.setItem('frolic_fontsize', fontSize)
        applyFontSize(fontSize)
    }, [fontSize])

    // Listen for OS theme change when 'auto' is selected
    useEffect(() => {
        if (theme !== 'auto') return
        const mql = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => applyTheme('auto')
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [theme])

    // Flash a "saved" indicator
    const flashSaved = (section) => {
        setShowSaved(section)
        setTimeout(() => setShowSaved(''), 1500)
    }

    return (
        <>
            {/* Theme Picker */}
            <SettingSection title="Theme" description="Choose a look and feel that works for you">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            id={`theme-${t.id}`}
                            onClick={() => { setTheme(t.id); flashSaved('theme') }}
                            className={`relative glass-card p-5 text-left transition-all duration-300 ${
                                theme === t.id
                                    ? 'border-accent-500/60 bg-accent-500/10 shadow-glow-sm'
                                    : 'hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                theme === t.id
                                    ? 'bg-accent-500/30 text-accent-400'
                                    : 'bg-white/10 text-white/50'
                            }`}>
                                <t.icon className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-semibold text-white">{t.label}</p>
                            <p className="text-xs text-white/40 mt-0.5">{t.desc}</p>
                            {theme === t.id && (
                                <motion.div
                                    layoutId="theme-check"
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center"
                                >
                                    <HiOutlineCheck className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
                {showSaved === 'theme' && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-emerald-400 mt-3 flex items-center gap-1"
                    >
                        <HiOutlineCheck className="w-3.5 h-3.5" /> Theme applied
                    </motion.p>
                )}
            </SettingSection>

            {/* Accent Color */}
            <SettingSection title="Accent Color" description="Personalize the interface highlight color">
                <div className="glass-card p-6">
                    <div className="flex flex-wrap gap-4">
                        {ACCENTS.map((a) => (
                            <button
                                key={a.id}
                                id={`accent-${a.id}`}
                                onClick={() => { setAccentColor(a.id); flashSaved('accent') }}
                                className={`w-11 h-11 rounded-full ${a.color} transition-all duration-300 flex items-center justify-center ${
                                    accentColor === a.id
                                        ? `ring-2 ${a.ring} ring-offset-2 ring-offset-midnight-950 scale-110`
                                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                                title={a.id.charAt(0).toUpperCase() + a.id.slice(1)}
                            >
                                {accentColor === a.id && (
                                    <HiOutlineCheck className="w-5 h-5 text-white drop-shadow" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Live preview swatch */}
                    <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div
                            className="w-8 h-8 rounded-lg shrink-0"
                            style={{ backgroundColor: `var(--accent-color, hsl(270, 70%, 60%))` }}
                        />
                        <div>
                            <p className="text-sm text-white font-medium">
                                {accentColor.charAt(0).toUpperCase() + accentColor.slice(1)}
                            </p>
                            <p className="text-xs text-white/40">Active accent — applied across the interface</p>
                        </div>
                    </div>

                    {showSaved === 'accent' && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-emerald-400 mt-3 flex items-center gap-1"
                        >
                            <HiOutlineCheck className="w-3.5 h-3.5" /> Accent color applied
                        </motion.p>
                    )}
                </div>
            </SettingSection>

            {/* Font Size */}
            <SettingSection title="Font Size" description="Adjust the base text size for readability">
                <div className="glass-card p-6">
                    <div className="flex gap-3">
                        {FONT_SIZES.map((fs) => (
                            <button
                                key={fs.id}
                                id={`fontsize-${fs.id}`}
                                onClick={() => { setFontSize(fs.id); flashSaved('font') }}
                                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    fontSize === fs.id
                                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40'
                                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {fs.label}
                            </button>
                        ))}
                    </div>

                    {/* Preview */}
                    <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-white/60 mb-2 text-xs uppercase tracking-wider">Preview</p>
                        <p className="text-white" style={{ fontSize: FONT_SIZES.find(f => f.id === fontSize)?.px || '16px' }}>
                            The quick brown fox jumps over the lazy dog.
                        </p>
                        <p className="text-white/50 mt-1" style={{ fontSize: FONT_SIZES.find(f => f.id === fontSize)?.px || '16px' }}>
                            Frolic Management System — current size: {FONT_SIZES.find(f => f.id === fontSize)?.px}
                        </p>
                    </div>

                    {showSaved === 'font' && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-emerald-400 mt-3 flex items-center gap-1"
                        >
                            <HiOutlineCheck className="w-3.5 h-3.5" /> Font size applied
                        </motion.p>
                    )}
                </div>
            </SettingSection>
        </>
    )
}
