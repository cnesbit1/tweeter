import { LoginRequest, UserSessionResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (
  request: LoginRequest
): Promise<UserSessionResponse> => {
  const service = new UserService();
  try {
    const [user, token] = await service.login(request.alias, request.password);
    return {
      success: true,
      message: null,
      user,
      authToken: token,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null,
      authToken: null,
    };
  }
};
