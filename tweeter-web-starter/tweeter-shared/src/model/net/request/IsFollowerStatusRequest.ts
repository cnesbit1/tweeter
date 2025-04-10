import { UserDto } from '../../dto/UserDto';
import { AuthUserRequest } from './AuthUserRequest';

export interface IsFollowerStatusRequest extends AuthUserRequest {
  selectedUser: UserDto;
}
