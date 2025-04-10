import { PostStatusRequest, TweeterResponse } from 'tweeter-shared';
import { StatusService } from '../../model/service/StatusService';

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const service = new StatusService();

  try {
    await service.postStatus(request.token, request.status);
    return {
      success: true,
      message: null,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }
};
