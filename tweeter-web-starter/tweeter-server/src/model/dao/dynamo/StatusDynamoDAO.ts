import { IStatusDAO, StoryResult } from '../interfaces/IStatusDAO';
import { StatusDto } from 'tweeter-shared';
import AWS from 'aws-sdk';
import { PagedStatusDAO } from './PagedStatusDAO';

const dynamo = new AWS.DynamoDB.DocumentClient();
const STORY_TABLE = 'Story';

export class StatusDynamoDAO extends PagedStatusDAO implements IStatusDAO {
  async postStatus(status: StatusDto): Promise<void> {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: STORY_TABLE,
      Item: {
        alias: status.user.alias,
        ...status,
      },
    };

    await dynamo.put(params).promise();
  }

  async getStory(
    alias: string,
    limit: number,
    lastTimestamp?: number
  ): Promise<StoryResult> {
    return this.queryPagedStatuses(STORY_TABLE, alias, limit, lastTimestamp);
  }
}
