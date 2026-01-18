
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { MapStats } from '../../types/data';

interface MapStatsProps {
    data: MapStats[];
}

export function MapStats({ data }: MapStatsProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="mapName"
                        type="category"
                        width={100}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        interval={0}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                    />
                    <Bar dataKey="totalGames" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
