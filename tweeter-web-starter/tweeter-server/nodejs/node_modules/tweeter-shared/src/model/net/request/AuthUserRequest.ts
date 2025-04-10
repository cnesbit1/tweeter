import { UserDto } from '../../dto/UserDto';
import { LogoutRequest } from './LogoutRequest';

export interface AuthUserRequest extends LogoutRequest {
  user: UserDto;
}
