import { LogoutRequest, TweeterResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  const service = new UserService();

  try {
    await service.logout(request.token);
    return {
      success: true,
      message: 'Successful Logout',
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }
};
