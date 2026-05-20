import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts'
import ChartCard from './ChartCard'
import { tooltipStyle } from './theme'

/**
 * PaymentStatusChart — Pie chart showing paid vs pending payment groups.
 * @param {{ data: Array<{name: string, value: number, fill: string}>, rate?: number, delay?: number }} props
 */
export default function PaymentStatusChart({ data = [], rate = 0, delay = 0 }) {
    const isEmpty = !data.length || data.every(d => d.value === 0)
    const totalGroups = data.reduce((s, d) => s + d.value, 0)

    const renderCenterLabel = ({ cx, cy }) => (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
            <tspan x={cx} y={cy - 8} fill="white" fontSize="26" fontWeight="700">
                {rate}%
            </tspan>
            <tspan x={cx} y={cy + 16} fill="rgba(255,255,255,0.4)" fontSize="11">
                Collection Rate
            </tspan>
        </text>
    )

    return (
        <ChartCard
            title="Payment Collection"
            subtitle={`${totalGroups} total groups`}
            height={300}
            delay={delay}
            headerRight={
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    rate >= 70 ? 'bg-emerald-500/15 text-emerald-400' :
                    rate >= 40 ? 'bg-amber-500/15 text-amber-400' :
                    'bg-rose-500/15 text-rose-400'
                }`}>
                    {rate >= 70 ? 'Healthy' : rate >= 40 ? 'Moderate' : 'Low'}
                </span>
            }
        >
            {isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <p className="text-white/30 text-sm">No payment data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            labelLine={false}
                            label={renderCenterLabel}
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
