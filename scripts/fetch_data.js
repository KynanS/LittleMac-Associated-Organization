import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const API_KEY = process.env.LIQUIPEDIA_API_KEY;
const USER_AGENT = 'SC2Analytics/1.0 (sc2-analytics@lmao.com)'; // Replace with real contact if possible
const API_ENDPOINT = 'https://api.liquipedia.net/api/v3/match';


if (!API_KEY) {
    console.error('Error: LIQUIPEDIA_API_KEY environment variable is not set.');
    console.error('Please create a .env file with LIQUIPEDIA_API_KEY=your_key_here');
    process.exit(1);
}

const WIKI = 'starcraft2';
const LIMIT = 1000;

// Active seasons that require live updates
const ACTIVE_TOURNAMENTS = [
    'LittleMac_StarCraft_II_League/14',
    'LittleMac_Master_League/11'
];

// Helper to construct the API URL
function buildUrl(offset = 0) {
    // Only fetch the ACTIVE tournaments
    const conditions = ACTIVE_TOURNAMENTS.map(t => `[[pagename::${t}]]`).join(' OR ');
    const query = 'match2id,date,pagename,tournament,winner,match2games,match2opponents,resulttype,bestof';

    const params = new URLSearchParams({
        wiki: WIKI,
        limit: LIMIT.toString(),
        offset: offset.toString(),
        conditions: conditions,
        query: query,
        order: 'date DESC'
    });

    return `${API_ENDPOINT}?${params.toString()}`;
}

async function fetchMatches() {
    let allMatches = [];
    let offset = 0;
    let hasMore = true;

    console.log(`Starting INCREMENTAL fetch for: ${ACTIVE_TOURNAMENTS.join(', ')}...`);

    while (hasMore) {
        const url = buildUrl(offset);
        console.log(`Fetching offset ${offset}...`);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Apikey ${API_KEY}`,
                    'User-Agent': USER_AGENT,
                    'Accept-Encoding': 'gzip'
                }
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.result && data.result.length > 0) {
                allMatches = allMatches.concat(data.result);
                offset += data.result.length;

                if (data.result.length < LIMIT) hasMore = false;
            } else {
                hasMore = false;
            }

            // Rate limit: 1 request per ~65 seconds for absolute safety per user request
            // (Since we likely only need 1 page, this won't slow us down much)
            if (hasMore) await new Promise(r => setTimeout(r, 65000));

        } catch (error) {
            console.error('Fetch error:', error);
            process.exit(1);
        }
    }

    console.log(`Active matches fetched: ${allMatches.length}`);
    return allMatches;
}

function saveData(newMatches) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.join(__dirname, '../public/data');
    const filePath = path.join(publicDir, 'matches.json');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    let finalData = [];

    // 1. Read existing data if possible
    if (fs.existsSync(filePath)) {
        try {
            const existingContent = fs.readFileSync(filePath, 'utf8');
            const existingMatches = JSON.parse(existingContent);
            console.log(`Loaded ${existingMatches.length} existing matches from file.`);

            // 2. Filter out OLD entries for the ACTIVE tournaments (so we can replace them)
            const historicalMatches = existingMatches.filter(m => !ACTIVE_TOURNAMENTS.includes(m.pagename));
            console.log(`Retained ${historicalMatches.length} historical matches.`);

            // 3. Merge
            finalData = [...historicalMatches, ...newMatches];
        } catch (e) {
            console.error("Error reading existing matches.json, overwriting with new data only.", e);
            finalData = newMatches;
        }
    } else {
        console.log("No existing matches.json found. Creating new file.");
        finalData = newMatches;
    }

    // 4. Save
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));
    console.log(`Successfully saved ${finalData.length} total matches to ${filePath}`);
}

// execute
fetchMatches().then(saveData);
