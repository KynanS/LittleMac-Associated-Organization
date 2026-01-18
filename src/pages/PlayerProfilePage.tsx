
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MatchCard } from '../components/matches/MatchCard';
import { getPlayerMatches, getPlayerStats } from '../lib/analytics';
import type { LiquipediaMatch, PlayerStats } from '../types/data';

export function PlayerProfilePage() {
    const { playerId } = useParams<{ playerId: string }>();
    const [matches, setMatches] = useState<LiquipediaMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [history, setHistory] = useState<LiquipediaMatch[]>([]);

    useEffect(() => {
        fetch('/data/matches.json')
            .then(res => res.json())
            .then((data: LiquipediaMatch[]) => {
                setMatches(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load matches", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!loading && playerId && matches.length > 0) {
            const pStats = getPlayerStats(matches, playerId);
            const pHistory = getPlayerMatches(matches, playerId);
            setStats(pStats);
            setHistory(pHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    }, [loading, playerId, matches]);

    if (loading) return <div className="p-8 text-center">Loading player data...</div>;
    if (!stats) return <div className="p-8 text-center">Player not found</div>;

    const getRaceColor = (race: string) => {
        if (race === 'terran') return 'text-terran';
        if (race === 'protoss') return 'text-protoss';
        if (race === 'zerg') return 'text-zerg';
        return 'text-muted-foreground';
    };

    const getRaceBg = (race: string) => {
        if (race === 'terran') return 'bg-terran/10 border-terran/20';
        if (race === 'protoss') return 'bg-protoss/10 border-protoss/20';
        if (race === 'zerg') return 'bg-zerg/10 border-zerg/20';
        return 'bg-secondary/50 border-border';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className={`relative overflow-hidden rounded-xl border p-8 ${getRaceBg(stats.race)}`}>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <div className="h-24 w-24 rounded-full border-4 border-background bg-card flex items-center justify-center text-4xl shadow-xl">
                        {stats.race === 'protoss' ? '🛡️' : stats.race === 'terran' ? '🎖️' : stats.race === 'zerg' ? '🧬' : '❓'}
                    </div>

                    <div className="space-y-2">
                        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary mb-2 inline-block">
                            &larr; Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 justify-center md:justify-start">
                            {stats.id}
                            <span className={`text-lg font-bold uppercase px-2 py-0.5 rounded border border-current opacity-70 ${getRaceColor(stats.race)}`}>
                                {stats.race}
                            </span>
                        </h1>
                        <div className="flex gap-4 justify-center md:justify-start text-sm font-medium text-muted-foreground">
                            <span>{stats.totalMatches} Series Played</span>
                        </div>
                    </div>

                    <div className="md:ml-auto flex gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-black text-primary">{stats.wins}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wins</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-destructive">{stats.losses}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Losses</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl font-black ${stats.winRate >= 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                                {stats.winRate}%
                            </div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Win Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Match History */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Match History</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {history.map(match => (
                        <MatchCard key={match.match2id} match={match} />
                    ))}
                </div>
            </div>
        </div>
    );
}
