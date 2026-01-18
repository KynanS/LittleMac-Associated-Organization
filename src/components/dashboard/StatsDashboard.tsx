import type { LiquipediaMatch } from '../../types/data';
import { getRaceStats, getMapStats } from '../../lib/analytics';
import { MapStats } from '../charts/MapStats';
import { WinRateChart } from '../charts/WinRateChart';

interface StatsDashboardProps {
    matches: LiquipediaMatch[];
}

export function StatsDashboard({ matches }: StatsDashboardProps) {
    const raceStats = getRaceStats(matches);
    const mapStats = getMapStats(matches);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Race Distribution Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-gray-900/40 backdrop-blur border-gray-800">
                    <h3 className="font-semibold text-lg mb-4 text-gray-100">Race Distribution</h3>
                    <WinRateChart stats={raceStats} />
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
                        <div>
                            <span className="block font-bold text-red-500">{raceStats.Terran}</span>
                            <span className="text-xs text-gray-500">Terran</span>
                        </div>
                        <div>
                            <span className="block font-bold text-purple-500">{raceStats.Zerg}</span>
                            <span className="text-xs text-gray-500">Zerg</span>
                        </div>
                        <div>
                            <span className="block font-bold text-orange-500">{raceStats.Protoss}</span>
                            <span className="text-xs text-gray-500">Protoss</span>
                        </div>
                        <div>
                            <span className="block font-bold text-gray-400">{raceStats.Random}</span>
                            <span className="text-xs text-gray-500">Random</span>
                        </div>
                    </div>
                </div>

                {/* Map Stats Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-gray-900/40 backdrop-blur border-gray-800">
                    <h3 className="font-semibold text-lg mb-4 text-gray-100">Top Maps Played</h3>
                    <MapStats data={mapStats.slice(0, 10)} />
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Total Games</div>
                    <div className="text-2xl font-bold text-white">{raceStats.Total}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Tournaments</div>
                    <div className="text-2xl font-bold text-white">{new Set(matches.map(m => m.tournament)).size}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="text-gray-400 text-sm">Players</div>
                    <div className="text-2xl font-bold text-white">{new Set(matches.flatMap(m => m.match2opponents.map(o => o.name))).size}</div>
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
