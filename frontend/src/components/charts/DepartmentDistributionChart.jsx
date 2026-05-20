import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle, axisStyle, gridStyle, CHART_COLORS, barMargin } from './theme'

/**
 * DepartmentDistributionChart — Vertical bar chart showing event count per department.
 * @param {{ data: Array<{name: string, events: number}>, delay?: number }} props
 */
export default function DepartmentDistributionChart({ data = [], delay = 0 }) {
    const isEmpty = !data.length

    return (
        <ChartCard
            title="Department-wise Events"
            subtitle="Event distribution across departments"
            height={300}
            delay={delay}
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No department data available</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={barMargin}>
                        <defs>
                            <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0.4} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid {...gridStyle} />
                        <XAxis
                            dataKey="name"
                            {...axisStyle}
                            interval={0}
                            angle={-25}
                            textAnchor="end"
                            height={50}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                        />
                        <YAxis {...axisStyle} allowDecimals={false} />
                        <Tooltip
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            itemStyle={tooltipStyle.itemStyle}
                            cursor={tooltipStyle.cursor}
                        />
                        <Bar
                            dataKey="events"
                            fill="url(#barGradientBlue)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                            name="Events"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
