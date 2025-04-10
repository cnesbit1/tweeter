"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const UserDynamoDAO_1 = require("./dynamo/UserDynamoDAO");
const AuthTokenDynamoDAO_1 = require("./dynamo/AuthTokenDynamoDAO");
const S3ImageDAO_1 = require("./dynamo/S3ImageDAO");
const FollowDynamoDAO_1 = require("./dynamo/FollowDynamoDAO");
const FeedDynamoDAO_1 = require("./dynamo/FeedDynamoDAO");
const StatusDynamoDAO_1 = require("./dynamo/StatusDynamoDAO");
class DynamoDAOFactory {
    static getUserDAO() {
        return new UserDynamoDAO_1.UserDynamoDAO();
    }
    static getAuthTokenDAO() {
        return new AuthTokenDynamoDAO_1.AuthTokenDynamoDAO();
    }
    static getImageDAO() {
        return new S3ImageDAO_1.S3ImageDAO();
    }
    static getFollowDAO() {
        return new FollowDynamoDAO_1.FollowDynamoDAO();
    }
    static getFeedDAO() {
        return new FeedDynamoDAO_1.FeedDynamoDAO();
    }
    static getStatusDAO() {
        return new StatusDynamoDAO_1.StatusDynamoDAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
