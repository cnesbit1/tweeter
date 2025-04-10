"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowDynamoDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const FOLLOWS_TABLE = 'Follows';
const FOLLOWEE_INDEX = 'FolloweeIndex'; // GSI: partitionKey = followeeAlias, sortKey = followerAlias
class FollowDynamoDAO {
    async follow(followerAlias, followeeAlias) {
        const params = {
            TableName: FOLLOWS_TABLE,
            Item: {
                followerAlias,
                followeeAlias,
            },
        };
        await dynamo.put(params).promise();
    }
    async unfollow(followerAlias, followeeAlias) {
        const params = {
            TableName: FOLLOWS_TABLE,
            Key: {
                followerAlias,
                followeeAlias,
            },
        };
        await dynamo.delete(params).promise();
    }
    async getFollowers(alias, limit, lastFollowerAlias) {
        const params = {
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
    async getFollowees(alias, limit, lastFolloweeAlias) {
        const params = {
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
    async getFollowerCount(alias) {
        const params = {
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
    async getFolloweeCount(alias) {
        const params = {
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
    async isFollower(followerAlias, followeeAlias) {
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
exports.FollowDynamoDAO = FollowDynamoDAO;
