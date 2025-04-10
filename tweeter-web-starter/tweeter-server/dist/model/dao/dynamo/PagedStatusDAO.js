"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedStatusDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class PagedStatusDAO {
    dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
    async queryPagedStatuses(tableName, alias, limit, lastTimestamp) {
        const params = {
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
            items: result.Items,
            lastTimestamp: result.LastEvaluatedKey?.timestamp,
        };
    }
}
exports.PagedStatusDAO = PagedStatusDAO;
