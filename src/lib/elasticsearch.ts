
import { Client } from '@elastic/elasticsearch';

if (!process.env.ELASTICSEARCH_HOST) {
  throw new Error('ELASTICSEARCH_HOST is not defined in environment variables');
}

// It's recommended to use an API Key for authentication for security.
// Ensure you have ELASTIC_API_KEY in your .env file.
if (!process.env.ELASTIC_USERNAME || !process.env.ELASTIC_PASSWORD) {
    console.warn('ELASTIC_USERNAME or ELASTIC_PASSWORD are not defined. Connecting without authentication.');
}

const esClient = new Client({
  node: process.env.ELASTICSEARCH_HOST,
  ...(process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD && {
    auth: {
      username: process.env.ELASTIC_USERNAME,
      password: process.env.ELASTIC_PASSWORD,
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
