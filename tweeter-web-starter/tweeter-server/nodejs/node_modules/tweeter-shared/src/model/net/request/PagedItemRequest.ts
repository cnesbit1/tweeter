import { LogoutRequest } from './LogoutRequest';

export interface PagedItemRequest<T> extends LogoutRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: T | null;
}
