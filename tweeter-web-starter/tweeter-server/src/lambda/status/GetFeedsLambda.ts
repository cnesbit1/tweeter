import { PagedItemRequest, PagedItemResponse, StatusDto } from 'tweeter-shared';
import { StatusService } from '../../model/service/StatusService';

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  const statusService = new StatusService();

  try {
    const [items, hasMore] = await statusService.loadMoreFeedItems(
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
