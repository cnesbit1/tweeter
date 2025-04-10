"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusDynamoDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const PagedStatusDAO_1 = require("./PagedStatusDAO");
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const STORY_TABLE = 'Story';
class StatusDynamoDAO extends PagedStatusDAO_1.PagedStatusDAO {
    async postStatus(status) {
        const params = {
            TableName: STORY_TABLE,
            Item: {
                alias: status.user.alias,
                ...status,
            },
        };
        await dynamo.put(params).promise();
    }
    async getStory(alias, limit, lastTimestamp) {
        return this.queryPagedStatuses(STORY_TABLE, alias, limit, lastTimestamp);
    }
}
exports.StatusDynamoDAO = StatusDynamoDAO;
