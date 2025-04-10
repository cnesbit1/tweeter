import {
  IsFollowerStatusRequest,
  IsFollowerStatusResponse,
} from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (
  request: IsFollowerStatusRequest
): Promise<IsFollowerStatusResponse> => {
  const service = new FollowService();

  try {
    const isFollower = await service.getIsFollowerStatus(
      request.token,
      request.user,
      request.selectedUser
    );

    return {
      success: true,
      message: null,
      isFollower,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      isFollower: false,
    };
  }
};
