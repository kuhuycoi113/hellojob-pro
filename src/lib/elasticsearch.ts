
'use server'; // Add this directive to ensure it's a server-only module

import { Client } from '@elastic/elasticsearch';

const elasticsearchHost = process.env.ELASTICSEARCH_HOST;
const elasticsearchUsername = process.env.ELASTIC_USERNAME;
const elasticsearchPassword = process.env.ELASTIC_PASSWORD;

if (!elasticsearchHost) {
  throw new Error('ELASTICSEARCH_HOST is not defined in environment variables');
}

export const client = new Client({
  node: elasticsearchHost,
  auth: {
    username: elasticsearchUsername!,
    password: elasticsearchPassword!,
  },
});

/**
 * Creates or updates a document in an index.
 * @param index - The name of the index.
 * @param id - The document ID.
 * @param body - The document body.
 */
export const createDocument = async (index: string, id: string, body: any) => {
  return await client.index({
    index,
    id,
    body,
    refresh: 'wait_for', // wait for the changes to be searchable
  });
};

/**
 * Retrieves a document from an index by its ID.
 * @param index - The name of the index.
 * @param id - The document ID.
 */
export const getDocument = async (index: string, id: string) => {
  return await client.get({
    index,
    id,
  });
};

/**
 * Partially updates a document in an index.
 * @param index - The name of the index.
 * @param id - The document ID.
 * @param doc - The partial document to update.
 */
export const updateDocument = async (index: string, id: string, doc: any) => {
  return await client.update({
    index,
    id,
    body: {
      doc,
    },
    refresh: 'wait_for',
  });
};

/**
 * Deletes a document from an index by its ID.
 * @param index - The name of the index.
 * @param id - The document ID.
 */
export const deleteDocument = async (index: string, id: string) => {
  return await client.delete({
    index,
    id,
    refresh: 'wait_for',
  });
};

/**
 * Searches for documents in an index.
 * @param index - The name of the index.
 * @param body - The search query body.
 */
export const searchDocuments = async (index: string, body: any) => {
    return await client.search({
        index,
        body,
    });
};


export default client;
