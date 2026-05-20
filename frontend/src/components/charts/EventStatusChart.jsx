import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle } from './theme'

/**
 * EventStatusChart — Donut chart with center summary for event lifecycle breakdown.
 * @param {{ data: Array<{name: string, value: number, fill: string}>, total?: number, delay?: number }} props
 */
export default function EventStatusChart({ data = [], total = 0, delay = 0 }) {
    const isEmpty = !data.length || data.every(d => d.value === 0)
    const displayTotal = total || data.reduce((s, d) => s + d.value, 0)

    const renderCustomLabel = ({ cx, cy }) => (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
            <tspan x={cx} y={cy - 8} fill="white" fontSize="28" fontWeight="700">
                {displayTotal}
            </tspan>
            <tspan x={cx} y={cy + 16} fill="rgba(255,255,255,0.4)" fontSize="12">
                Total Events
            </tspan>
        </text>
    )

    return (
        <ChartCard
            title="Event Status"
            subtitle="Lifecycle breakdown"
            height={300}
            delay={delay}
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No events created yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                            labelLine={false}
                            label={renderCustomLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={tooltipStyle.contentStyle}
                            labelStyle={tooltipStyle.labelStyle}
                            itemStyle={tooltipStyle.itemStyle}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </ChartCard>
    )
}
