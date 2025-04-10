import { RegisterRequest, UserSessionResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (
  request: RegisterRequest
): Promise<UserSessionResponse> => {
  const service = new UserService();
  try {
    const [userDto, authToken] = await service.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension
    );

    return {
      success: true,
      message: null,
      user: userDto,
      authToken: authToken,
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
