
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
interface RaceDistributionStat {
    name: string;
    value: number;
    [key: string]: any; // Allow index signature for Recharts
}

const COLORS = {
    Terran: '#ef233c', // Redish - fallback
    Zerg: '#8338ec',   // Purple - fallback
    Protoss: '#fb8500',// Orange - fallback
    Random: '#2b2d42', // Dark
};

// Use CSS variables if possible, or fallbacks
const getRaceColor = (race: string) => {
    if (race === 'Terran') return 'hsl(var(--terran))';
    if (race === 'Zerg') return 'hsl(var(--zerg))';
    if (race === 'Protoss') return 'hsl(var(--protoss))';
    return COLORS[race as keyof typeof COLORS] || '#888';
};

interface RaceDistributionChartProps {
    stats: RaceDistributionStat[];
}

export function RaceDistributionChart({ stats }: RaceDistributionChartProps) {
    return (
        <div className="h-[300px] w-full rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Race Distribution</h3>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getRaceColor(entry.name)} stroke="hsl(var(--background))" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
