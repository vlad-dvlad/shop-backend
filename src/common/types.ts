export type Nullable<T> = T | null;

export interface PaginatedData<T> {
  data: T[];
  total: number;
  pages: Nullable<number>;
  nextPage: Nullable<number>;
  prevPage: Nullable<number>;
}

export enum UserRole {
  USER = 'USER',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
