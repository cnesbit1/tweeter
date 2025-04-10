"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDynamoDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const AUTHTOKENS_TABLE = 'AuthToken';
const TOKEN_TTL_SECONDS = 3600;
class AuthTokenDynamoDAO {
    async generateToken(alias) {
        const token = (0, uuid_1.v4)();
        const expiration = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
        const params = {
            TableName: AUTHTOKENS_TABLE,
            Item: {
                token: token,
                alias: alias,
                ttl: expiration,
            },
        };
        await dynamo.put(params).promise();
        return token;
    }
    async isValidToken(token) {
        const params = {
            TableName: AUTHTOKENS_TABLE,
            Key: {
                token: token,
            },
        };
        const result = await dynamo.get(params).promise();
        return !!result.Item;
    }
    async deleteToken(token) {
        const params = {
            TableName: AUTHTOKENS_TABLE,
            Key: {
                token: token,
            },
        };
        await dynamo.delete(params).promise();
    }
    async getAliasForToken(token) {
        const result = await dynamo
            .get({
            TableName: AUTHTOKENS_TABLE,
            Key: { token },
        })
            .promise();
        if (!result.Item)
            throw new Error('Token not found');
        return result.Item.alias;
    }
}
exports.AuthTokenDynamoDAO = AuthTokenDynamoDAO;
