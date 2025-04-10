import { AuthAliasRequest, GetUserResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (
  request: AuthAliasRequest
): Promise<GetUserResponse> => {
  const service = new UserService();
  try {
    const user = await service.getUser(request.token, request.alias);
    return {
      success: true,
      user: user!,
      message: null,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }
};
