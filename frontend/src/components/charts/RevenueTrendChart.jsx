import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle, gridStyle } from './theme'

/**
 * RevenueTrendChart — Area chart showing revenue collected over time.
 * @param {{ data: Array<{month: string, revenue: number, cumulative: number}>, totalRevenue?: number, delay?: number }} props
 */
export default function RevenueTrendChart({ data = [], totalRevenue = 0, delay = 0 }) {
    const isEmpty = !data.length || data.every(d => d.revenue === 0)

    return (
        <ChartCard
            title="Revenue Trend"
            subtitle={`₹${totalRevenue.toLocaleString()} collected`}
            height={280}
            delay={delay}
            headerRight={
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-500/15 text-teal-400">
                    💰 Live
                </span>
            }
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No revenue data yet — registrations with fees will appear here</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid {...gridStyle} />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${v}`}
                        />
                        <Tooltip
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            itemStyle={tooltipStyle.itemStyle}
                            formatter={(value, name) => [
                                `₹${value.toLocaleString()}`,
                                name === 'revenue' ? 'Monthly' : 'Cumulative'
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#cumulativeGradient)"
                            dot={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                            dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }}
                            activeDot={{ r: 5, fill: '#14b8a6', stroke: '#14b8a6', strokeWidth: 2, strokeOpacity: 0.3 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
