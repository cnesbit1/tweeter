import type { UserDto } from '../../dto/UserDto';
import { TweeterResponse } from './TweeterResponse';

export interface UserSessionResponse extends TweeterResponse {
  user: UserDto | null;
  authToken: string | null;
}
