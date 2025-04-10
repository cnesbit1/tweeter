import AWS from 'aws-sdk';
import { StoryResult } from '../interfaces/IStatusDAO';
import { StatusDto } from 'tweeter-shared';

export abstract class PagedStatusDAO {
  protected dynamo = new AWS.DynamoDB.DocumentClient();

  protected async queryPagedStatuses(
    tableName: string,
    alias: string,
    limit: number,
    lastTimestamp?: number
  ): Promise<StoryResult> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      KeyConditionExpression: 'alias = :alias',
      ExpressionAttributeValues: { ':alias': alias },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: lastTimestamp
        ? { alias, timestamp: lastTimestamp }
        : undefined,
    };

    const result = await this.dynamo.query(params).promise();

    return {
      items: result.Items as StatusDto[],
      lastTimestamp: result.LastEvaluatedKey?.timestamp,
    };
  }
}
