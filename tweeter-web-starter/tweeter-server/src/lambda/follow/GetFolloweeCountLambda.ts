import { AuthAliasRequest, CountResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (
  request: AuthAliasRequest
): Promise<CountResponse> => {
  const service = new FollowService();

  try {
    const count = await service.getFolloweeCount(request.token, request.alias);

    return {
      success: true,
      message: null,
      count,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      count: 0,
    };
  }
};
