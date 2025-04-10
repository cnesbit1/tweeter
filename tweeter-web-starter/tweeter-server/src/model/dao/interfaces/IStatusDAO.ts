import { StatusDto } from 'tweeter-shared';

export interface StoryResult {
  readonly items: StatusDto[] | null;
  readonly lastTimestamp: number;
}

export interface IStatusDAO {
  postStatus(status: StatusDto): Promise<void>;

  getStory(
    alias: string,
    limit: number,
    lastTimestamp?: number
  ): Promise<StoryResult>;
}
