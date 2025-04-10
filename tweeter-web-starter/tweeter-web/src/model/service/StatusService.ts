import {
  AuthToken,
  Status,
  StatusDto,
  PostStatusRequest,
  TweeterResponse,
  PagedItemRequest,
  PagedItemResponse,
} from 'tweeter-shared';
import { Service } from './Service';

export class StatusService extends Service {

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };

    const response: PagedItemResponse<StatusDto> =
      await this.serverFacade.getFeed(request);

    const statuses = (response.items ?? []).map((dto) =>
      Status.fromDto(dto)
    ) as Status[];

    return [statuses, response.hasMore];
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };

    const response: PagedItemResponse<StatusDto> =
      await this.serverFacade.getStory(request);

    console.log(response);
    const statuses: Status[] = (response.items ?? []).map((dto) =>
      Status.fromDto(dto)
    ) as Status[];

    return [statuses, response.hasMore];
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      token: authToken.token,
      status: newStatus.dto,
    };

    const _response: TweeterResponse = await this.serverFacade.postStatus(
      request
    );
    // Handle response if needed
  }
}
