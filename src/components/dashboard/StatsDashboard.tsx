import type { LiquipediaMatch } from '../../types/data';
import { getWinRates, getMapStats } from '../../lib/analytics';
import { MapStats } from '../charts/MapStats';
import { RaceDistributionChart } from '../charts/RaceDistributionChart';
import { WinRateChart } from '../charts/WinRateChart';

interface StatsDashboardProps {
    matches: LiquipediaMatch[];
}

export function StatsDashboard({ matches }: StatsDashboardProps) {
    const winRates = getWinRates(matches);
    const mapStats = getMapStats(matches);

    // Derive Race Distribution (Game Participation)
    const raceDist = [
        { name: 'Terran', value: winRates.terran.total },
        { name: 'Zerg', value: winRates.zerg.total },
        { name: 'Protoss', value: winRates.protoss.total },
        { name: 'Random', value: winRates.random.total },
    ].filter(s => s.value > 0);

    const raceCounts = {
        Terran: winRates.terran.total,
        Zerg: winRates.zerg.total,
        Protoss: winRates.protoss.total,
        Random: winRates.random.total,
        // Calculate total games by summing scores from all matches
        Total: matches.reduce((acc, m) => {
            const s1 = m.match2opponents?.[0]?.score ?? 0;
            const s2 = m.match2opponents?.[1]?.score ?? 0;
            return acc + s1 + s2;
        }, 0)
    };

    // Derive Win Rates for Chart
    const winRateData = [
        { race: 'Terran', winRate: winRates.terran.winRate, wins: winRates.terran.wins, losses: winRates.terran.losses },
        { race: 'Zerg', winRate: winRates.zerg.winRate, wins: winRates.zerg.wins, losses: winRates.zerg.losses },
        { race: 'Protoss', winRate: winRates.protoss.winRate, wins: winRates.protoss.wins, losses: winRates.protoss.losses },
        // { race: 'Random', ... } - usually hide win rate for random unless desired
    ].filter(s => (s.wins + s.losses) > 0);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Race Distribution Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-gray-900/40 backdrop-blur border-gray-800">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Race Distribution (Games)</h3>
                    <RaceDistributionChart stats={raceDist} />
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
                        <div>
                            <span className="block font-bold text-terran">{raceCounts.Terran}</span>
                            <span className="text-xs text-muted-foreground">Terran</span>
                        </div>
                        <div>
                            <span className="block font-bold text-zerg">{raceCounts.Zerg}</span>
                            <span className="text-xs text-muted-foreground">Zerg</span>
                        </div>
                        <div>
                            <span className="block font-bold text-protoss">{raceCounts.Protoss}</span>
                            <span className="text-xs text-muted-foreground">Protoss</span>
                        </div>
                        <div>
                            <span className="block font-bold text-muted-foreground">{raceCounts.Random}</span>
                            <span className="text-xs text-muted-foreground">Random</span>
                        </div>
                    </div>
                </div>

                {/* Win Rates Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-gray-900/40 backdrop-blur border-gray-800">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Global Win Rates</h3>
                    <WinRateChart stats={winRateData} />
                </div>

                {/* Map Stats Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-gray-900/40 backdrop-blur border-gray-800 md:col-span-2">
                    <h3 className="font-semibold text-lg mb-4 text-gray-100">Top Maps Played</h3>
                    <MapStats data={mapStats.slice(0, 10)} />
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Total Games</div>
                    <div className="text-2xl font-bold text-white">{Math.round(raceCounts.Total)}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Tournaments</div>
                    <div className="text-2xl font-bold text-white">{new Set(matches.map(m => m.tournament)).size}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Players</div>
                    <div className="text-2xl font-bold text-white max-w-full truncate" title={String(new Set(matches.flatMap(m => m.match2opponents?.map(o => o.name) || [])).size)}>
                        {new Set(matches.flatMap(m => m.match2opponents?.map(o => o.name) || [])).size}
                    </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Latest Match</div>
                    <div className="text-lg font-bold text-white truncate">
                        {matches.length > 0 ? new Date(matches[0].date).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
}
