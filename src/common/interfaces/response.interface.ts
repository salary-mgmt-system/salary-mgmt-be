/**
 * Standard paginated API response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Standard API success response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
