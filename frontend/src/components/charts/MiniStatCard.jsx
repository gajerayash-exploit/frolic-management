import { motion } from 'framer-motion'

/**
 * MiniStatCard — Premium stat card with animated value, icon, trend badge, and sparkline.
 *
 * @param {string}  label       - Metric label (e.g. "Total Events")
 * @param {string|number} value - Display value
 * @param {string}  gradient    - Tailwind gradient classes for the icon bg
 * @param {React.ReactNode} icon - Icon component
 * @param {number}  delay       - Stagger animation delay
 * @param {boolean} loading     - Show skeleton state
 * @param {string}  badge       - Optional badge text (e.g. "12 active")
 * @param {string}  badgeColor  - Badge color class (e.g. "emerald", "amber")
 * @param {number[]} sparkData  - Array of 5-7 numbers for the sparkline
 */
export default function MiniStatCard({
    label,
    value,
    gradient = 'from-blue-500 to-cyan-500',
    icon,
    delay = 0,
    loading = false,
    badge = null,
    badgeColor = 'emerald'
}) {

    const badgeColors = {
        emerald: 'bg-emerald-500/15 text-emerald-400',
        amber: 'bg-amber-500/15 text-amber-400',
        blue: 'bg-blue-500/15 text-blue-400',
        rose: 'bg-rose-500/15 text-rose-400',
        purple: 'bg-purple-500/15 text-purple-400',
        cyan: 'bg-cyan-500/15 text-cyan-400',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: 'easeOut' }}
            className="glass-card-hover p-4 group relative overflow-hidden"
        >
            {/* Ambient glow on hover */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.07] blur-2xl transition-opacity duration-500`} />

            {/* Absolute Top-Right Badge */}
            {badge && !loading && (
                <div className="absolute top-3 right-3 z-20">
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[badgeColor] || badgeColors.emerald} shadow-sm whitespace-nowrap tracking-wider`}>
                        {badge}
                    </span>
                </div>
            )}

            <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Top Row: Icon */}
                <div className="flex items-start mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
                        {icon}
                    </div>
                </div>

                {/* Bottom Row: Value/Label */}
                <div className="flex items-end justify-between mt-auto">
                    <div className="flex-1">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse" />
                                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <p className="text-3xl font-bold text-white tracking-tight mb-1">
                                    {value}
                                </p>
                                <p className="text-sm text-white/50 truncate text-center">{label}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
