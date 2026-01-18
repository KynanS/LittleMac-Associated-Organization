import type { LiquipediaMatch } from '../../types/data';

interface MatchCardProps {
    match: LiquipediaMatch;
}

export function MatchCard({ match }: MatchCardProps) {
    const mainOpponent = match.match2opponents?.[0];
    const secondOpponent = match.match2opponents?.[1];

    if (!mainOpponent || !secondOpponent) return null;

    return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="text-sm text-gray-400 mb-2 flex justify-between">
                <span>{match.tournament}</span>
                <span>{new Date(match.date).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center">
                <div className={`text-lg font-bold ${mainOpponent.score > secondOpponent.score ? 'text-green-400' : 'text-gray-200'}`}>
                    {mainOpponent.name}
                </div>
                <div className="px-4 py-1 bg-gray-900 rounded text-xl font-mono">
                    {mainOpponent.score} - {secondOpponent.score}
                </div>
                <div className={`text-lg font-bold ${secondOpponent.score > mainOpponent.score ? 'text-green-400' : 'text-gray-200'}`}>
                    {secondOpponent.name}
                </div>
            </div>

            <div className="mt-2 text-center text-xs text-gray-500 uppercase">
                {match.bestof ? `Best of ${match.bestof}` : 'Match'}
            </div>
        </div>
    );
}
