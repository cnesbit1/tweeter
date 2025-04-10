import { AliasRequest } from './AliasRequest';

export interface RegisterRequest extends AliasRequest {
  firstName: string;
  lastName: string;
  password: string;
  userImageBytes: string;
  imageFileExtension: string;
}
