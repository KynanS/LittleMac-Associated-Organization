
import type { LiquipediaMatch } from '../types/data';

export type RaceStats = {
    Terran: number;
    Zerg: number;
    Protoss: number;
    Random: number;
    Total: number;
};

export type MapStat = {
    name: string;
    value: number; // Games played
};

export function getRaceStats(matches: LiquipediaMatch[]): RaceStats {
    const stats = { Terran: 0, Zerg: 0, Protoss: 0, Random: 0, Total: 0 };

    matches.forEach(match => {
        if (!match.match2opponents) return;
        if (match.match2opponents) match.match2opponents.forEach(opponent => {
            // Check match2players first (standard for query)
            if (opponent.match2players && opponent.match2players.length > 0) {
                opponent.match2players.forEach(p => {
                    const r = p.race?.toLowerCase();
                    if (r === 't') stats.Terran++;
                    else if (r === 'z') stats.Zerg++;
                    else if (r === 'p') stats.Protoss++;
                    else if (r === 'r') stats.Random++;
                });
            }
        });
    });

    stats.Total = stats.Terran + stats.Zerg + stats.Protoss + stats.Random;
    return stats;
}

export function getMapStats(matches: LiquipediaMatch[]): MapStat[] {
    const mapCounts: Record<string, number> = {};

    matches.forEach(match => {
        if (match.match2games) {
            match.match2games.forEach(game => {
                const mapName = game.map;
                if (mapName) {
                    mapCounts[mapName] = (mapCounts[mapName] || 0) + 1;
                }
            });
        }
    });

    return Object.entries(mapCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}
