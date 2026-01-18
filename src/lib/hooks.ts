
import { useState, useEffect } from 'react';
import type { LiquipediaMatch } from '../types/data';

export function useMatches(filterTournament?: string) {
    const [matches, setMatches] = useState<LiquipediaMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch('/data/matches.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch match data');
                return res.json();
            })
            .then((data: LiquipediaMatch[]) => {
                let filtered = data;
                if (filterTournament) {
                    // Simple case-insensitive include check
                    filtered = data.filter(m =>
                        m.tournament.toLowerCase().includes(filterTournament.toLowerCase())
                    );
                }
                setMatches(filtered);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [filterTournament]);

    return { matches, loading, error };
}
