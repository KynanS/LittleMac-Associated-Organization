import { useEffect, useState } from 'react';
import { fetchMatches } from '../lib/api';
import type { LiquipediaMatch } from '../types/data';

export function DataVerifier() {
    const [matches, setMatches] = useState<LiquipediaMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async (useMock: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMatches({ useMock, limit: 5 });
            setMatches(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(true); // Default to mock
    }, []);

    return (
        <div className="p-8 text-white bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Data Verification</h1>

            <div className="mb-6 space-x-4">
                <button
                    onClick={() => loadData(true)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                >
                    Load Mock Data
                </button>
                <button
                    onClick={() => loadData(false)}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                >
                    Attempt Real API (Requires Key)
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}

            <div className="grid gap-4">
                {matches.map(match => (
                    <div key={match.match2id} className="p-4 bg-slate-800 rounded border border-slate-700">
                        <div className="font-bold text-lg">{match.tournament}</div>
                        <div className="text-sm text-gray-400">{match.date}</div>
                        <div className="mt-2 flex items-center gap-2">
                            <span>{match.match2opponents[0]?.name}</span>
                            <span className="font-mono text-xl">{match.match2opponents[0]?.score} - {match.match2opponents[1]?.score}</span>
                            <span>{match.match2opponents[1]?.name}</span>
                        </div>
                        <details className="mt-2">
                            <summary className="cursor-pointer text-blue-400">View Raw JSON</summary>
                            <pre className="mt-2 p-2 bg-black text-xs overflow-auto max-h-40">
                                {JSON.stringify(match, null, 2)}
                            </pre>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    );
}
