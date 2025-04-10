import { PagedItemRequest, PagedItemResponse, UserDto } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService();

  try {
    const [items, hasMore] = await followService.loadMoreFollowers(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    return {
      success: true,
      message: null,
      items,
      hasMore,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      items: [],
      hasMore: false,
    };
  }
};
