
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { RaceStats } from '../../lib/analytics';

const COLORS = {
    Terran: '#ef233c', // Redish
    Zerg: '#8338ec',   // Purple/Zerg-y
    Protoss: '#fb8500',// Golden/Orange
    Random: '#2b2d42', // Dark
};

interface WinRateChartProps {
    stats: RaceStats;
}

export function WinRateChart({ stats }: WinRateChartProps) {
    const data = [
        { name: 'Terran', value: stats.Terran },
        { name: 'Zerg', value: stats.Zerg },
        { name: 'Protoss', value: stats.Protoss },
        { name: 'Random', value: stats.Random },
    ].filter(d => d.value > 0);

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
