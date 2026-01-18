export interface LiquipediaMatch {
    match2id: string;
    date: string;
    tournament: string;
    pagename: string; // Added this property
    winner?: string;
    resulttype: string;
    bestof: number;
    match2opponents: MatchOpponent[];
    match2games?: MatchGame[];
}

export interface MatchOpponent {
    name: string;
    id: string;
    score: number;
    placement: number; // 1 for winner, 2 for loser (usually)
    match2players?: {
        name?: string; // Added name and displayname to nested player object
        displayname?: string;
        race?: string; // Sometimes present
        extradata?: {
            faction?: string; // "p", "t", "z", "r"
        }
    }[];
    player?: {
        id: string;
        name: string;
        localizedname?: string;
        nationality?: string;
    }
}

export interface MatchGame {
    map: string;
    winner: string; // "1" or "2" usually, representing the index of the opponent
    duration?: number;
    participants?: Record<string, {
        faction?: string;
        player?: string;
    }>;
}

export interface RaceStats {
    wins: number;
    losses: number;
    total: number;
    winRate: number;
}

export interface MatchupStats {
    wins: number;
    losses: number;
    total: number;
    winRate: number;
}

export interface WinRateStats {
    terran: RaceStats;
    zerg: RaceStats;
    protoss: RaceStats;
    random: RaceStats;
    matchups: Record<string, MatchupStats>; // e.g., "TvZ": { total: 10, ... }
}

export interface MapStats {
    mapName: string;
    totalGames: number;
    terranWins: number;
    zergWins: number;
    protossWins: number;
    winRateT: number; // Terran win rate on this map
    winRateZ: number; // Zerg win rate on this map
    winRateP: number; // Protoss win rate on this map
}

export interface PlayerStats {
    id: string;
    name: string;
    race: string;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    mmr?: number; // If available or calculated
}
