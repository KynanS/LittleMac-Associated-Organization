import { useMatches } from '../lib/hooks';
import { StatsDashboard } from '../components/dashboard/StatsDashboard';
import { MatchList } from '../components/matches/MatchList';
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-gray-400">
                    Showing statistics for {matches.length} matches.
                </p>
            </div>

            <StatsDashboard matches={matches} />

            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-100">Match History</h2>
                <MatchList matches={matches} />
            </div>
        </div>
    );
}
