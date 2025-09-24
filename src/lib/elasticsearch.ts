
import { Client } from '@elastic/elasticsearch';

const elasticsearchHost = process.env.ELASTICSEARCH_HOST;
const elasticsearchUsername = process.env.ELASTIC_USERNAME;
const elasticsearchPassword = process.env.ELASTIC_PASSWORD;

if (!elasticsearchHost) {
  throw new Error('ELASTICSEARCH_HOST is not defined in environment variables');
}

if (!elasticsearchUsername || !elasticsearchPassword) {
    console.warn('ELASTIC_USERNAME or ELASTIC_PASSWORD are not defined. Connecting without authentication is not supported with this configuration.');
    // Or throw an error if auth is mandatory
    // throw new Error('ELASTIC_USERNAME and ELASTIC_PASSWORD are required for authentication.');
}

export const client = new Client({
  node: elasticsearchHost,
  auth: {
    username: elasticsearchUsername!,
    password: elasticsearchPassword!,
  },
});

export default client;
