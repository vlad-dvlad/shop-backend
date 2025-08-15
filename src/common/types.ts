export type Nullable<T> = T | null;

export interface PaginatedData<T> {
  data: T[];
  total: number;
  pages: Nullable<number>;
  nextPage: Nullable<number>;
  prevPage: Nullable<number>;
}
