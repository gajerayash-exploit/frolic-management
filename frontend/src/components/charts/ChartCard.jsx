import { motion } from 'framer-motion'

/**
 * ChartCard — Glassmorphism wrapper for all chart panels.
 * Provides consistent glass-card styling, title, subtitle, and layout.
 *
 * @param {string}  title       - Card header title
 * @param {string}  subtitle    - Optional description text
 * @param {string}  className   - Additional CSS classes for grid sizing
 * @param {number}  height      - Chart area height in pixels (default: 280)
 * @param {number}  delay       - Framer Motion stagger delay
 * @param {React.ReactNode} children - Chart content
 * @param {React.ReactNode} headerRight - Optional element in header right side
 */
export default function ChartCard({
    title,
    subtitle,
    className = '',
    height = 280,
    delay = 0,
    children,
    headerRight = null,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
            className={`glass-card p-5 lg:p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="text-base font-semibold text-white leading-tight">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-white/40 mt-1">{subtitle}</p>
                    )}
                </div>
                {headerRight && (
                    <div className="text-right">{headerRight}</div>
                )}
            </div>

            {/* Chart Area */}
            <div style={{ height: `${height}px` }} className="w-full">
                {children}
            </div>
        </motion.div>
    )
}
