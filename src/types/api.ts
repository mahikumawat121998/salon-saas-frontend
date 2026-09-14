/**
 * Standard API Response structure enforced across all modules
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Standard Paginated API Response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Standard API Error Response format
 */
export interface ApiErrorPayload {
  success: false;
  message: string | string[];
  error?: string;
  statusCode?: number;
}
