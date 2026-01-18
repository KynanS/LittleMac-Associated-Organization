import type { LiquipediaMatch } from '../types/data';

const API_BASE_URL = 'https://api.liquipedia.net/api/v3';
const WIKI = 'starcraft2';

export interface ApiOptions {
    limit?: number;
    offset?: number;
    useMock?: boolean;
}

export async function fetchMatches(options: ApiOptions = {}): Promise<LiquipediaMatch[]> {
    const { limit = 20, offset = 0, useMock = true } = options;

    if (useMock) {
        return generateMockMatches(limit);
    }

    const apiKey = import.meta.env.VITE_LIQUIPEDIA_API_KEY;
    if (!apiKey) {
        console.warn('No API key found, falling back to mock data.');
        return generateMockMatches(limit);
    }

    try {
        const params = new URLSearchParams({
            wiki: WIKI,
            limit: limit.toString(),
            offset: offset.toString(),
            conditions: '[[date::>2023-01-01]]', // Example condition
        });

        const response = await fetch(`${API_BASE_URL}/match?${params.toString()}`, {
            headers: {
                'Authorization': `Apikey ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.result || [];
    } catch (error) {
        console.error('Failed to fetch matches:', error);
        return generateMockMatches(limit); // Fallback to mock on error for now
    }
}

function generateMockMatches(count: number): LiquipediaMatch[] {
    return Array.from({ length: count }).map((_, i) => ({
        match2id: `mock-${i}`,
        date: new Date(Date.now() - i * 86400000).toISOString(),
        tournament: 'Mock Tournament 2025',
        resulttype: 'single',
        bestof: 3,
        match2opponents: [
            {
                name: 'Player A',
                id: 'player-a',
                score: 2,
                placement: 1,
                match2players: [{ race: 't' }],
                player: { id: 'p1', name: 'Player A', nationality: 'KR' }
            },
            {
                name: 'Player B',
                id: 'player-b',
                score: 1,
                placement: 2,
                match2players: [{ race: 'z' }],
                player: { id: 'p2', name: 'Player B', nationality: 'FR' }
            }
        ],
        match2games: [
            { map: 'Ancient Cistern LE', winner: '1', duration: 1200 },
            { map: 'Dragon Scales LE', winner: '2', duration: 900 },
            { map: 'Gresvan LE', winner: '1', duration: 1500 }
        ]
    }));
}
