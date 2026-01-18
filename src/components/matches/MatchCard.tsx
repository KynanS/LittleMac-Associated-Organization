import { Link } from 'react-router-dom';
import type { LiquipediaMatch } from '../../types/data';

interface MatchCardProps {
    match: LiquipediaMatch;
}

// Helper for race colors
function getFactionColor(faction?: string) {
    const f = faction?.toLowerCase();
    if (f === 'p') return 'bg-protoss/20 text-protoss border-protoss/50';
    if (f === 't') return 'bg-terran/20 text-terran border-terran/50';
    if (f === 'z') return 'bg-zerg/20 text-zerg border-zerg/50';
    return 'bg-secondary text-secondary-foreground border-border';
}

function getFactionIcon(faction?: string) {
    const f = faction?.toLowerCase();
    if (f === 'p') return '🛡️';
    if (f === 't') return '🎖️';
    if (f === 'z') return '🧬';
    return '❓';
}

export function MatchCard({ match }: MatchCardProps) {
    // ... logic remains same ...
    const p1 = match.match2opponents?.[0]?.match2players?.[0];
    const p2 = match.match2opponents?.[1]?.match2players?.[0];

    const score1 = match.match2opponents?.[0]?.score ?? 0;
    const score2 = match.match2opponents?.[1]?.score ?? 0;

    const p1Name = p1?.displayname || p1?.name || "Unknown";
    const p2Name = p2?.displayname || p2?.name || "Unknown";

    return (
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:border-primary/50 transition-colors">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {match.tournament.split(':')[0]}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                        {match.date.split(' ')[0]}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    {/* Player 1 */}
                    <Link to={`/player/${encodeURIComponent(p1Name)}`} className="flex-1 flex flex-col items-center gap-2 group hover:opacity-80 transition-opacity">
                        <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-xl shadow-inner ${getFactionColor(p1?.extradata?.faction)} group-hover:scale-110 transition-transform`}>
                            {getFactionIcon(p1?.extradata?.faction)}
                        </div>
                        <span className={`font-bold text-center truncate w-full ${match.winner === '1' ? 'text-primary' : ''}`}>
                            {p1Name}
                        </span>
                    </Link>

                    {/* VS / Score */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <div className="text-2xl font-black tracking-widest font-mono">
                            {score1}-{score2}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground border border-border px-1.5 rounded">
                            BO{match.bestof}
                        </span>
                    </div>

                    {/* Player 2 */}
                    <Link to={`/player/${encodeURIComponent(p2Name)}`} className="flex-1 flex flex-col items-center gap-2 group hover:opacity-80 transition-opacity">
                        <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-xl shadow-inner ${getFactionColor(p2?.extradata?.faction)} group-hover:scale-110 transition-transform`}>
                            {getFactionIcon(p2?.extradata?.faction)}
                        </div>
                        <span className={`font-bold text-center truncate w-full ${match.winner === '2' ? 'text-primary' : ''}`}>
                            {p2Name}
                        </span>
                    </Link>
                </div>
            </div>

            <div className="px-4 py-3 bg-secondary/30 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]" title={match.match2id}>
                    ID: {match.match2id}
                </span>
                {/* Map count indicator could go here */}
            </div>
        </div>
    );
}
