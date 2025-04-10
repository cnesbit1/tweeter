import { LogoutRequest } from './LogoutRequest';

export interface AuthAliasRequest extends LogoutRequest {
  alias: string;
}
