import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface WinRateData {
    race: string;
    winRate: number;
    wins: number;
    losses: number;
}

interface WinRateChartProps {
    stats: WinRateData[];
}

const getRaceColor = (race: string) => {
    if (race === 'Terran') return 'hsl(var(--terran))';
    if (race === 'Zerg') return 'hsl(var(--zerg))';
    if (race === 'Protoss') return 'hsl(var(--protoss))';
    return '#888';
};

export function WinRateChart({ stats }: WinRateChartProps) {
    return (
        <div className="h-[300px] w-full rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Win Rates by Faction</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={stats}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                        dataKey="race"
                        type="category"
                        width={60}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: any) => [`${value}%`, 'Win Rate'] as any}
                    />
                    <Bar dataKey="winRate" radius={[0, 4, 4, 0]}>
                        {stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getRaceColor(entry.race)} />
                        ))}
                        <LabelList
                            dataKey="winRate"
                            position="right"
                            fill="hsl(var(--foreground))"
                            formatter={(val: any) => `${val}%` as any}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
