import { StatusDto } from 'tweeter-shared';
import { StoryResult } from './IStatusDAO';

export interface IFeedDAO {
  addStatusToFeeds(followerAliases: string[], status: StatusDto): Promise<void>;

  getFeed(
    alias: string,
    limit: number,
    lastTimestamp?: number
  ): Promise<StoryResult>;
}
