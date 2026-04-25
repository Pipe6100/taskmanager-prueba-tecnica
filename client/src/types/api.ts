export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }
  
  export interface ApiError {
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string[]>;
  }
  