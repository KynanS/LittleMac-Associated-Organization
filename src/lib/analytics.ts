import type { LiquipediaMatch, WinRateStats, MapStats, MatchupStats, RaceStats, PlayerStats } from '../types/data';

// Helper to normalize race strings (e.g., "p" -> "protoss")
const normalizeRace = (race: string | undefined): 'terran' | 'zerg' | 'protoss' | 'random' | 'unknown' => {
    if (!race) return 'unknown';
    const r = race.toLowerCase();
    if (r.startsWith('t')) return 'terran';
    if (r.startsWith('z')) return 'zerg';
    if (r.startsWith('p')) return 'protoss';
    if (r.startsWith('r')) return 'random';
    return 'unknown';
};

const INITIAL_RACE_STATS: RaceStats = { wins: 0, losses: 0, total: 0, winRate: 0 };
const INITIAL_MATCHUP_STATS: MatchupStats = { wins: 0, losses: 0, total: 0, winRate: 0 };

export function getWinRates(matches: LiquipediaMatch[]): WinRateStats {
    // Deep copy initial stats to avoid reference issues
    const stats: WinRateStats = {
        terran: { ...INITIAL_RACE_STATS },
        zerg: { ...INITIAL_RACE_STATS },
        protoss: { ...INITIAL_RACE_STATS },
        random: { ...INITIAL_RACE_STATS },
        matchups: {},
    };

    matches.forEach((match) => {
        if (!match.match2games) return;

        match.match2games.forEach((game) => {
            const winnerIndex = game.winner; // "1" or "2"
            const loserIndex = winnerIndex === '1' ? '2' : '1';

            const p1Key = `${winnerIndex}_1`;
            const p2Key = `${loserIndex}_1`;

            const winnerData = game.participants?.[p1Key];
            const loserData = game.participants?.[p2Key];

            if (!winnerData || !loserData) return;

            const winnerRace = normalizeRace(winnerData.faction);
            const loserRace = normalizeRace(loserData.faction);

            if (winnerRace === 'unknown' || loserRace === 'unknown') return;

            // Update Race Stats (Game Wins)
            if (stats[winnerRace]) {
                stats[winnerRace].wins++;
                stats[winnerRace].total++;
            }
            if (stats[loserRace]) {
                stats[loserRace].losses++;
                stats[loserRace].total++;
            }

            // Update Matchups
            const races = [winnerRace, loserRace].sort();
            const r1Char = races[0].charAt(0).toUpperCase();
            const r2Char = races[1].charAt(0).toUpperCase();
            const matchupKey = `${r1Char}v${r2Char}`;

            if (!stats.matchups[matchupKey]) {
                stats.matchups[matchupKey] = { ...INITIAL_MATCHUP_STATS };
            }

            stats.matchups[matchupKey].total++;

            // If the defined "first race" in the key (races[0]) is the winner:
            if (winnerRace === races[0]) {
                stats.matchups[matchupKey].wins++;
            } else {
                stats.matchups[matchupKey].losses++;
            }
        });
    });

    // Calculate percentages
    (['terran', 'zerg', 'protoss', 'random'] as const).forEach(r => {
        if (stats[r].total > 0) {
            stats[r].winRate = Math.round((stats[r].wins / stats[r].total) * 100);
        }
    });

    Object.keys(stats.matchups).forEach(key => {
        const m = stats.matchups[key];
        if (m.total > 0) {
            m.winRate = Math.round((m.wins / m.total) * 100);
        }
    });

    return stats;
}

export function getMapStats(matches: LiquipediaMatch[]): MapStats[] {
    const mapMap: Record<string, MapStats> = {};

    matches.forEach(match => {
        if (!match.match2games) return;
        match.match2games.forEach(game => {
            const mapName = game.map;
            if (!mapName) return;

            if (!mapMap[mapName]) {
                mapMap[mapName] = {
                    mapName,
                    totalGames: 0,
                    terranWins: 0,
                    zergWins: 0,
                    protossWins: 0,
                    winRateT: 0,
                    winRateZ: 0,
                    winRateP: 0
                };
            }

            const winnerIndex = game.winner;
            const p1Key = `${winnerIndex}_1`;
            const winnerData = game.participants?.[p1Key];

            if (!winnerData) return;
            const winnerRace = normalizeRace(winnerData.faction);

            mapMap[mapName].totalGames++;

            if (winnerRace === 'terran') mapMap[mapName].terranWins++;
            if (winnerRace === 'zerg') mapMap[mapName].zergWins++;
            if (winnerRace === 'protoss') mapMap[mapName].protossWins++;
        });
    });


    return Object.values(mapMap).sort((a, b) => b.totalGames - a.totalGames);
}

export function getPlayerMatches(matches: LiquipediaMatch[], playerId: string): LiquipediaMatch[] {
    const normalizedId = playerId.toLowerCase();
    return matches.filter(match => {
        // Check both opponents
        const p1 = match.match2opponents?.[0]?.match2players?.[0];
        const p2 = match.match2opponents?.[1]?.match2players?.[0];

        // Check if name or displayname matches
        // We use a loose match because IDs/names can be inconsistent
        const p1Name = (p1?.name || p1?.displayname || "").toLowerCase();
        const p2Name = (p2?.name || p2?.displayname || "").toLowerCase();

        return p1Name === normalizedId || p2Name === normalizedId;
    });
}

export function getPlayerStats(matches: LiquipediaMatch[], playerId: string): PlayerStats {
    const playerMatches = getPlayerMatches(matches, playerId);
    const normalizedId = playerId.toLowerCase();

    let wins = 0;
    let losses = 0;
    let raceMap: Record<string, number> = { terran: 0, zerg: 0, protoss: 0, random: 0 };

    playerMatches.forEach(match => {
        const p1 = match.match2opponents?.[0]?.match2players?.[0];
        const p2 = match.match2opponents?.[1]?.match2players?.[0];

        const p1Name = (p1?.name || p1?.displayname || "").toLowerCase();
        let isP1 = p1Name === normalizedId;

        // Determine player and result
        // Winner is "1" or "2"
        const playerWon = (isP1 && match.winner === '1') || (!isP1 && match.winner === '2');

        if (playerWon) wins++;
        else losses++;

        // Determine race
        const playerData = isP1 ? p1 : p2;
        const race = normalizeRace(playerData?.extradata?.faction);
        if (race !== 'unknown') {
            raceMap[race]++;
        }
    });

    // Determine main race (most played)
    let mainRace = 'random';
    let maxGames = 0;
    Object.entries(raceMap).forEach(([r, count]) => {
        if (count > maxGames) {
            maxGames = count;
            mainRace = r;
        }
    });

    const total = wins + losses;

    return {
        id: playerId,
        name: playerId, // We'll assume the ID queried is the display name for now
        race: mainRace,
        totalMatches: total,
        wins,
        losses,
        winRate: total > 0 ? Math.round((wins / total) * 100) : 0
    };
}
