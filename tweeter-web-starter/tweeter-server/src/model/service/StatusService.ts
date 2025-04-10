import { StatusDto } from 'tweeter-shared';
import { DynamoDAOFactory } from '../dao/DynamoDAOFactory';
import { Service } from './Service';
import { StoryResult } from '../dao/interfaces/IStatusDAO';

export class StatusService extends Service {
  private statusDAO = DynamoDAOFactory.getStatusDAO();
  private feedDAO = DynamoDAOFactory.getFeedDAO();
  private followDAO = DynamoDAOFactory.getFollowDAO();

  private async loadMoreStatuses(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    fetchFn: (
      alias: string,
      pageSize: number,
      lastKey?: number
    ) => Promise<StoryResult>
  ): Promise<[StatusDto[], boolean]> {
    await this.validateToken(token);

    const lastTimestamp = lastItem?.timestamp ?? undefined;
    const result = await fetchFn(userAlias, pageSize, lastTimestamp);

    const hasMore = result.lastTimestamp !== undefined;
    return [result.items ?? [], hasMore];
  }

  public loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMoreStatuses(
      token,
      userAlias,
      pageSize,
      lastItem,
      this.feedDAO.getFeed.bind(this.feedDAO)
    );
  }

  public loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.loadMoreStatuses(
      token,
      userAlias,
      pageSize,
      lastItem,
      this.statusDAO.getStory.bind(this.statusDAO)
    );
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.validateToken(token);
    await this.statusDAO.postStatus(newStatus);

    const followers = await this.followDAO.getFollowers(
      newStatus.user.alias,
      10000
    );
    await this.feedDAO.addStatusToFeeds(followers, newStatus);
  }
}
