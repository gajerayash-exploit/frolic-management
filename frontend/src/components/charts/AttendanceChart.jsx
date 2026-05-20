import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle, axisStyle, gridStyle, CHART_COLORS, barMargin } from './theme'

/**
 * AttendanceChart — Dual bar chart comparing present vs absent groups per event.
 * @param {{ data: Array<{name: string, present: number, absent: number}>, rate?: number, delay?: number }} props
 */
export default function AttendanceChart({ data = [], rate = 0, delay = 0 }) {
    const isEmpty = !data.length

    return (
        <ChartCard
            title="Attendance Overview"
            subtitle="Present vs absent per event"
            height={300}
            delay={delay}
            headerRight={
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{rate}%</p>
                    <p className="text-[10px] text-white/40">Attendance Rate</p>
                </div>
            }
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No attendance data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={barMargin}>
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
                            dataKey="present"
                            fill={CHART_COLORS.emerald}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                            name="Present"
                            opacity={0.85}
                        />
                        <Bar
                            dataKey="absent"
                            fill={CHART_COLORS.rose}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                            name="Absent"
                            opacity={0.65}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
