import { IFeedDAO } from '../interfaces/IFeedDAO';
import { StatusDto } from 'tweeter-shared';
import AWS from 'aws-sdk';
import { StoryResult } from '../interfaces/IStatusDAO';
import { PagedStatusDAO } from './PagedStatusDAO';
const dynamo = new AWS.DynamoDB.DocumentClient();
const FEED_TABLE = 'Feed';

export class FeedDynamoDAO extends PagedStatusDAO implements IFeedDAO {
  async addStatusToFeeds(
    followerAliases: string[],
    status: StatusDto
  ): Promise<void> {
    const BATCH_SIZE = 25;

    for (let i = 0; i < followerAliases.length; i += BATCH_SIZE) {
      const batch = followerAliases.slice(i, i + BATCH_SIZE);

      const putRequests = batch.map((alias) => ({
        PutRequest: {
          Item: {
            alias,
            ...status,
          },
        },
      }));

      const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [FEED_TABLE]: putRequests,
        },
      };

      await dynamo.batchWrite(params).promise();
    }
  }

  async getFeed(
    alias: string,
    limit: number,
    lastTimestamp?: number
  ): Promise<StoryResult> {
    return this.queryPagedStatuses(FEED_TABLE, alias, limit, lastTimestamp);
  }
}
