import { StatusDto } from '../../dto/StatusDto';
import { LogoutRequest } from './LogoutRequest';

export interface PostStatusRequest extends LogoutRequest {
  status: StatusDto;
}
