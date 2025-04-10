import { IFollowDAO } from '../interfaces/IFollowDAO';
import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();
const FOLLOWS_TABLE = 'Follows';
const FOLLOWEE_INDEX = 'FolloweeIndex'; // GSI: partitionKey = followeeAlias, sortKey = followerAlias

export class FollowDynamoDAO implements IFollowDAO {
  async follow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: FOLLOWS_TABLE,
      Item: {
        followerAlias,
        followeeAlias,
      },
    };
    await dynamo.put(params).promise();
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: FOLLOWS_TABLE,
      Key: {
        followerAlias,
        followeeAlias,
      },
    };
    await dynamo.delete(params).promise();
  }

  async getFollowers(
    alias: string,
    limit: number,
    lastFollowerAlias?: string
  ): Promise<string[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWS_TABLE,
      IndexName: FOLLOWEE_INDEX,
      KeyConditionExpression: 'followeeAlias = :alias',
      ExpressionAttributeValues: {
        ':alias': alias,
      },
      Limit: limit,
      ExclusiveStartKey: lastFollowerAlias
        ? { followeeAlias: alias, followerAlias: lastFollowerAlias }
        : undefined,
    };

    const result = await dynamo.query(params).promise();
    return (result.Items ?? []).map((item) => item.followerAlias);
  }

  async getFollowees(
    alias: string,
    limit: number,
    lastFolloweeAlias?: string
  ): Promise<string[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWS_TABLE,
      KeyConditionExpression: 'followerAlias = :alias',
      ExpressionAttributeValues: {
        ':alias': alias,
      },
      Limit: limit,
      ExclusiveStartKey: lastFolloweeAlias
        ? { followerAlias: alias, followeeAlias: lastFolloweeAlias }
        : undefined,
    };

    const result = await dynamo.query(params).promise();
    return (result.Items ?? []).map((item) => item.followeeAlias);
  }

  async getFollowerCount(alias: string): Promise<number> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWS_TABLE,
      IndexName: FOLLOWEE_INDEX,
      KeyConditionExpression: 'followeeAlias = :alias',
      ExpressionAttributeValues: {
        ':alias': alias,
      },
      Select: 'COUNT',
    };

    const result = await dynamo.query(params).promise();
    return result.Count ?? 0;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: FOLLOWS_TABLE,
      KeyConditionExpression: 'followerAlias = :alias',
      ExpressionAttributeValues: {
        ':alias': alias,
      },
      Select: 'COUNT',
    };

    const result = await dynamo.query(params).promise();
    return result.Count ?? 0;
  }

  async isFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: FOLLOWS_TABLE,
      Key: {
        followerAlias,
        followeeAlias,
      },
    };

    const result = await dynamo.get(params).promise();
    return !!result.Item;
  }
}
