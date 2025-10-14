import { Client } from '@elastic/elasticsearch';
import type { RequestBody, TransportRequestPromise } from '@elastic/elasticsearch/lib/Transport';
import type { SearchHit } from '@elastic/elasticsearch/api/types';
import { PaginatedResponse } from './types';

const elasticsearchHost = process.env.ELASTICSEARCH_HOST;
const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

if (!elasticsearchHost) {
  throw new Error('ELASTICSEARCH_HOST is not defined in environment variables');
}
if (!elasticsearchUsername) {
  throw new Error('ELASTICSEARCH_USERNAME is not defined in environment variables');
}
if (!elasticsearchPassword) {
  throw new Error('ELASTICSEARCH_PASSWORD is not defined in environment variables');
}


export const client = new Client({
  node: elasticsearchHost,
  auth: {
    username: elasticsearchUsername,
    password: elasticsearchPassword,
  },
});

/**
 * Creates or updates a document in a specific index.
 * @param index - The name of the index.
 * @param id - The ID of the document.
 * @param body - The content of the document.
 * @returns Promise containing the result from Elasticsearch.
 */
export const createDocument = <T extends RequestBody>(
  index: string,
  id: string,
  body: T
): TransportRequestPromise<any> => {
  return client.index({
    index,
    id,
    body,
    refresh: 'wait_for',
  });
};

/**
 * Retrieves a document from an index by its ID.
 * @param index - The name of the index.
 * @param id - The ID of the document.
 * @returns Promise containing the found document.
 */
export const getDocument = <T = unknown>(
  index: string,
  id: string
): Promise<T | null> => {
  return client.get({
    index,
    id,
  }).then(response => ({ id: response.body._id, ...response.body._source as any }) as T)
    .catch(error => {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    });
};

/**
 * Updates a part of an existing document.
 * @param index - The name of the index.
 * @param id - The ID of the document to update.
 * @param body - The fields to update.
 * @returns Promise containing the update result.
 */
export const updateDocument = <T extends RequestBody>(
  index: string,
  id: string,
  body: Partial<T>
): TransportRequestPromise<any> => {
  return client.update({
    index,
    id,
    body: {
      doc: body,
    },
    refresh: 'wait_for',
  });
};

/**
 * Deletes a document from an index.
 * @param index - The name of the index.
 * @param id - The ID of the document to delete.
 * @returns Promise containing the deletion result.
 */
export const deleteDocument = (
  index: string,
  id: string
): TransportRequestPromise<any> => {
  return client.delete({
    index,
    id,
    refresh: 'wait_for',
  });
};

/**
 * Performs a search query with pagination.
 * @param index - The name of the index to search.
 * @param query - The Elasticsearch query object.
 * @param page - The current page number (1-based).
 * @param limit - The number of results per page.
 * @returns Promise containing the paginated search results.
 */
export const searchDocuments = async <T = any>(
  index: string,
  query: RequestBody,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<T>> => {
  const from = (page - 1) * limit;

  const response = await client.search({
    index,
    body: query,
    from,
    size: limit,
    track_total_hits: true,
  });
  console.log(JSON.stringify({
    index,
    body: query,
    from,
    size: limit,
    track_total_hits: true,
  }));

  const hits = response.body.hits.hits as SearchHit<T>[];
  const total = (response.body.hits.total as any).value ?? 0;

  return {
    docs: hits.map(hit => ({ ...hit._source, id: hit._id } as T)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export const countDocuments = async (
  index: string,
  query: RequestBody
): Promise<number> => {
  const response = await client.count({
    index,
    body: query,
  });
  return (response.body.count as number) ?? 0;
};
