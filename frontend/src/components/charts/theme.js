/**
 * Shared chart theme configuration for Frolic Management dashboards.
 * All chart components pull colors, gradients, and styling from here
 * to ensure visual consistency with the midnight/glass-card aesthetic.
 */

// ─── Chart Color Palette ─────────────────────────────────────────
// Curated to match the Tailwind accent/primary/midnight palette
export const CHART_COLORS = {
    purple:   '#a855f7',
    blue:     '#3b82f6',
    cyan:     '#06b6d4',
    emerald:  '#10b981',
    amber:    '#f59e0b',
    rose:     '#f43f5e',
    orange:   '#f97316',
    pink:     '#ec4899',
    indigo:   '#6366f1',
    teal:     '#14b8a6',
}

// Ordered array for pie/bar charts
export const COLOR_SEQUENCE = [
    CHART_COLORS.purple,
    CHART_COLORS.blue,
    CHART_COLORS.emerald,
    CHART_COLORS.amber,
    CHART_COLORS.cyan,
    CHART_COLORS.rose,
    CHART_COLORS.orange,
    CHART_COLORS.pink,
    CHART_COLORS.indigo,
    CHART_COLORS.teal,
]

// ─── Tooltip Styling ─────────────────────────────────────────────
export const tooltipStyle = {
    contentStyle: {
        background: 'rgba(15, 23, 42, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '10px 14px',
        fontSize: '13px',
    },
    labelStyle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 500,
        marginBottom: '4px',
        fontSize: '12px',
    },
    itemStyle: {
        color: '#fff',
        padding: '2px 0',
        fontSize: '13px',
    },
    cursor: { fill: 'rgba(168, 85, 247, 0.08)' },
}

// ─── Axis & Grid Styling ─────────────────────────────────────────
export const axisStyle = {
    tick: { fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 },
    axisLine: { stroke: 'rgba(255, 255, 255, 0.06)' },
    tickLine: false,
}

export const gridStyle = {
    strokeDasharray: '3 3',
    stroke: 'rgba(255, 255, 255, 0.06)',
    vertical: false,
}

// ─── SVG Gradient Definitions ────────────────────────────────────
// Use these IDs in chart fill props: fill="url(#gradientPurple)"
export const GRADIENT_DEFS = {
    purple: { id: 'gradientPurple', start: '#a855f7', end: 'rgba(168, 85, 247, 0.05)' },
    blue:   { id: 'gradientBlue',   start: '#3b82f6', end: 'rgba(59, 130, 246, 0.05)' },
    emerald:{ id: 'gradientEmerald', start: '#10b981', end: 'rgba(16, 185, 129, 0.05)' },
    cyan:   { id: 'gradientCyan',   start: '#06b6d4', end: 'rgba(6, 182, 212, 0.05)' },
}

// ─── Chart Margins ───────────────────────────────────────────────
export const defaultMargin = { top: 10, right: 10, left: -10, bottom: 0 }
export const barMargin = { top: 10, right: 10, left: -20, bottom: 0 }
