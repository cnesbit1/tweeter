"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedDynamoDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const PagedStatusDAO_1 = require("./PagedStatusDAO");
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const FEED_TABLE = 'Feed';
class FeedDynamoDAO extends PagedStatusDAO_1.PagedStatusDAO {
    async addStatusToFeeds(followerAliases, status) {
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
            const params = {
                RequestItems: {
                    [FEED_TABLE]: putRequests,
                },
            };
            await dynamo.batchWrite(params).promise();
        }
    }
    async getFeed(alias, limit, lastTimestamp) {
        return this.queryPagedStatuses(FEED_TABLE, alias, limit, lastTimestamp);
    }
}
exports.FeedDynamoDAO = FeedDynamoDAO;
