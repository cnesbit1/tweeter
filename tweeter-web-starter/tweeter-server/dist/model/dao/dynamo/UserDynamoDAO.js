"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDynamoDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dynamo = new aws_sdk_1.default.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users';
class UserDynamoDAO {
    async getUserByAlias(alias) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                alias: alias,
            },
        };
        const result = await dynamo.get(params).promise();
        return result.Item ?? null;
    }
    async createUser(user, hashedPassword) {
        const existingUser = await this.getUserByAlias(user.alias);
        if (existingUser) {
            throw new Error('Alias already taken');
        }
        const params = {
            TableName: USERS_TABLE,
            Item: {
                ...user,
                hashedPassword: hashedPassword,
            },
        };
        await dynamo.put(params).promise();
    }
    async validateCredentials(alias, plainTextPassword) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                alias: alias,
            },
            ProjectionExpression: 'hashedPassword',
        };
        const result = await dynamo.get(params).promise();
        const storedHash = result.Item?.hashedPassword;
        if (!storedHash) {
            return false;
        }
        return bcryptjs_1.default.compareSync(plainTextPassword, storedHash);
    }
}
exports.UserDynamoDAO = UserDynamoDAO;
