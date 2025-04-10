import { AuthUserRequest, FollowCountResponse } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (
  request: AuthUserRequest
): Promise<FollowCountResponse> => {
  const service = new FollowService();

  try {
    const [followerCount, followeeCount] = await service.followUser(
      request.token,
      request.user
    );

    return {
      success: true,
      message: null,
      followerCount,
      followeeCount,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      followerCount: 0,
      followeeCount: 0,
    };
  }
};
