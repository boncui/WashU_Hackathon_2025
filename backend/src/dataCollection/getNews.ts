import {getJson} from 'serpapi';

type NewsParams = {
    engine?: string;
    apiKey?: string;
    query: string,
    location: string,
    tbm?: string
}

export async function getNews({
    engine = 'google',
    apiKey = process.env.SERF_API_KEY,
    query,
    location,
    tbm = 'nws',
}: NewsParams){
    try {
        const response = await getJson({
              engine: engine,
              api_key: apiKey,
              q: query,
              location: location,
              tbm: tbm
            });
        return response;
    } catch (error){
        console.error("Error fetching news");
        throw error;
    }
}