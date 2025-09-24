
import { Client } from '@elastic/elasticsearch';

if (!process.env.ELASTIC_BASE_URL) {
  throw new Error('ELASTIC_BASE_URL is not defined in environment variables');
}

// It's recommended to use an API Key for authentication for security.
// Ensure you have ELASTIC_API_KEY in your .env file.
if (!process.env.ELASTIC_API_KEY) {
    console.warn('ELASTIC_API_KEY is not defined. Connecting without authentication.');
}

const esClient = new Client({
  node: process.env.ELASTIC_BASE_URL,
  ...(process.env.ELASTIC_API_KEY && {
    auth: {
      apiKey: process.env.ELASTIC_API_KEY
    }
  })
});

/**
 * Searches a specific index in Elasticsearch.
 * @param index The name of the index to search.
 * @param query The Elasticsearch query body.
 * @returns The search results.
 */
export async function search(index: string, query: object) {
  try {
    const result = await esClient.search({
      index: index,
      body: query,
    });
    return result.hits.hits;
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    throw new Error('Failed to fetch data from Elasticsearch.');
  }
}

export default esClient;
