export interface LiquipediaMatch {
    match2id: string;
    date: string;
    tournament: string;
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
        race?: string;
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
}
