
import { useMatches } from '../lib/hooks';
import { getRaceStats, getMapStats } from '../lib/analytics';
import { WinRateChart } from '../components/charts/WinRateChart';
import { MapStats } from '../components/charts/MapStats';
import { Loader2, AlertCircle } from 'lucide-react';

interface TournamentDashboardProps {
    title: string;
    filterStr: string;
}

export function TournamentDashboard({ title, filterStr }: TournamentDashboardProps) {
    const { matches, loading, error } = useMatches(filterStr);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[300px] flex-col items-center justify-center text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Error loading data: {error}</p>
                <p className="text-sm text-gray-400 mt-2">Make sure `public/data/matches.json` exists.</p>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p>No matches found for "{filterStr}".</p>
                <p className="text-sm">Run the fetch script to populate data.</p>
            </div>
        );
    }

    const raceStats = getRaceStats(matches);
    const mapStats = getMapStats(matches).slice(0, 10); // Top 10 maps

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-gray-400">
                    Showing statistics for {matches.length} matches.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Race Distribution Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 bg-gray-900/40 backdrop-blur border-gray-800">
                    <h3 className="font-semibold text-lg mb-4">Race Distribution</h3>
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
                    <h3 className="font-semibold text-lg mb-4">Top Maps Played</h3>
                    <MapStats data={mapStats} />
                </div>
            </div>

            {/* Recent Matches List could go here */}
        </div>
    );
}
