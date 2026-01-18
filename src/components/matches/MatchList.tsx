import type { LiquipediaMatch } from '../../types/data';
import { MatchCard } from './MatchCard';

interface MatchListProps {
    matches: LiquipediaMatch[];
    loading?: boolean;
}

export function MatchList({ matches, loading }: MatchListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                No matches found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {matches.map((match) => (
                <MatchCard key={match.match2id} match={match} />
            ))}
        </div>
    );
}
