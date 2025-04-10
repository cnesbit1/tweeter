import { UserDto } from './UserDto';

export interface StatusDto {
  post: string;
  timestamp: number;
  user: UserDto;
}
