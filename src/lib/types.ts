export type PaginatedResponse<T> = {
    docs: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }