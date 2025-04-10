import { AliasRequest } from './AliasRequest';

export interface LoginRequest extends AliasRequest {
  password: string;
}
