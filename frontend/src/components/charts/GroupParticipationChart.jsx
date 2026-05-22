import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle, axisStyle, gridStyle, CHART_COLORS, GRADIENT_DEFS, defaultMargin } from './theme'

/**
 * GroupParticipationChart — Area chart with cumulative team participation over time.
 * @param {{ data: Array<{month: string, teams: number, cumulative: number}>, delay?: number, className?: string }} props
 */
export default function GroupParticipationChart({ data = [], delay = 0, className = "" }) {
    const isEmpty = !data.length || data.every(d => d.teams === 0)

    return (
        <ChartCard
            title="Group Participation"
            subtitle="Teams formed over the last 6 months"
            className={className}
            height={300}
            delay={delay}
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No group data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={defaultMargin}>
                        <defs>
                            <linearGradient id={GRADIENT_DEFS.emerald.id} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENT_DEFS.emerald.start} stopOpacity={0.35} />
                                <stop offset="100%" stopColor={GRADIENT_DEFS.emerald.end} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={GRADIENT_DEFS.cyan.id} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={GRADIENT_DEFS.cyan.start} stopOpacity={0.25} />
                                <stop offset="100%" stopColor={GRADIENT_DEFS.cyan.end} stopOpacity={0} />
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
                            dataKey="cumulative"
                            stroke={CHART_COLORS.emerald}
                            strokeWidth={2.5}
                            fill={`url(#${GRADIENT_DEFS.emerald.id})`}
                            name="Cumulative Teams"
                            dot={{ fill: CHART_COLORS.emerald, strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: CHART_COLORS.emerald, stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="teams"
                            stroke={CHART_COLORS.cyan}
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fill={`url(#${GRADIENT_DEFS.cyan.id})`}
                            name="New Teams"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
