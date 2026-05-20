import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle, axisStyle, gridStyle, CHART_COLORS, barMargin } from './theme'

/**
 * InstituteActivityChart — Horizontal bar chart showing department and event counts per institute.
 * @param {{ data: Array<{name: string, departments: number, events: number}>, delay?: number }} props
 */
export default function InstituteActivityChart({ data = [], delay = 0 }) {
    const isEmpty = !data.length

    return (
        <ChartCard
            title="Institute Activity"
            subtitle="Departments & events per institute"
            height={300}
            delay={delay}
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No institute data available</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                    >
                        <CartesianGrid {...gridStyle} horizontal={false} vertical />
                        <XAxis type="number" {...axisStyle} allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={100}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                            axisLine={axisStyle.axisLine}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            itemStyle={tooltipStyle.itemStyle}
                            cursor={tooltipStyle.cursor}
                        />
                        <Legend
                            verticalAlign="top"
                            height={30}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                                    {value}
                                </span>
                            )}
                        />
                        <Bar
                            dataKey="departments"
                            fill={CHART_COLORS.cyan}
                            radius={[0, 4, 4, 0]}
                            maxBarSize={20}
                            name="Departments"
                            opacity={0.85}
                        />
                        <Bar
                            dataKey="events"
                            fill={CHART_COLORS.purple}
                            radius={[0, 4, 4, 0]}
                            maxBarSize={20}
                            name="Events"
                            opacity={0.85}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
