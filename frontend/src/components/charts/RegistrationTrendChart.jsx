import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle, axisStyle, gridStyle, CHART_COLORS, GRADIENT_DEFS, defaultMargin } from './theme'

/**
 * RegistrationTrendChart — Gradient area chart showing group registrations over time.
 * @param {{ data: Array<{month: string, registrations: number}>, delay?: number }} props
 */
export default function RegistrationTrendChart({ data = [], delay = 0 }) {
    const isEmpty = !data.length || data.every(d => d.registrations === 0)

    return (
        <ChartCard
            title="Registration Trends"
            subtitle="Group registrations over the last 6 months"
            className="lg:col-span-2"
            height={300}
            delay={delay}
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No registration data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={defaultMargin}>
                        <defs>
                            <linearGradient id={GRADIENT_DEFS.purple.id} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENT_DEFS.purple.start} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={GRADIENT_DEFS.purple.end} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={GRADIENT_DEFS.blue.id} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENT_DEFS.blue.start} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={GRADIENT_DEFS.blue.end} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid {...gridStyle} />
                        <XAxis dataKey="month" {...axisStyle} />
                        <YAxis {...axisStyle} allowDecimals={false} />
                        <Tooltip
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            itemStyle={tooltipStyle.itemStyle}
                            cursor={tooltipStyle.cursor}
                        />
                        <Area
                            type="monotone"
                            dataKey="registrations"
                            stroke={CHART_COLORS.purple}
                            strokeWidth={2.5}
                            fill={`url(#${GRADIENT_DEFS.purple.id})`}
                            name="Registrations"
                            dot={{ fill: CHART_COLORS.purple, strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: CHART_COLORS.purple, stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
