import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API_KEY = process.env.LIQUIPEDIA_API_KEY;
const USER_AGENT = 'SC2Analytics/1.0 (sc2-analytics@lmao.com)'; // Replace with real contact if possible
const API_ENDPOINT = 'https://api.liquipedia.net/api/v3/match';

if (!API_KEY) {
    console.error('Error: LIQUIPEDIA_API_KEY environment variable is not set.');
    process.exit(1);
}

const WIKI = 'starcraft2';
const LIMIT = 1000;

// Helper to construct the API URL
function buildUrl(offset = 0) {
    const conditions = '[[tournament::LittleMac StarCraft II League]] OR [[tournament::LittleMac Master League]]';
    const query = 'match2id,date,tournament,winner,match2games,match2opponents,resulttype,bestof';

    // Note: Liquipedia API requires proper encoding
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

    console.log('Starting data fetch from LiquipediaDB...');

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

                // If we got fewer than LIMIT, we're done
                if (data.result.length < LIMIT) {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }

            // delay to be nice to the API
            await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
            console.error('Fetch error:', error);
            process.exit(1);
        }
    }

    console.log(`Total matches fetched: ${allMatches.length}`);
    return allMatches;
}

function saveData(matches) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const publicDir = path.join(__dirname, '../public/data');

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, 'matches.json');
    fs.writeFileSync(filePath, JSON.stringify(matches, null, 2));
    console.log(`Data saved to ${filePath}`);
}

// execute
fetchMatches().then(saveData);
