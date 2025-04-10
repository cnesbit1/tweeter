"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const DynamoDAOFactory_1 = require("../dao/DynamoDAOFactory");
const Service_1 = require("./Service");
class StatusService extends Service_1.Service {
    statusDAO = DynamoDAOFactory_1.DynamoDAOFactory.getStatusDAO();
    feedDAO = DynamoDAOFactory_1.DynamoDAOFactory.getFeedDAO();
    followDAO = DynamoDAOFactory_1.DynamoDAOFactory.getFollowDAO();
    async loadMoreStatuses(token, userAlias, pageSize, lastItem, fetchFn) {
        await this.validateToken(token);
        const lastTimestamp = lastItem?.timestamp ?? undefined;
        const result = await fetchFn(userAlias, pageSize, lastTimestamp);
        const hasMore = result.lastTimestamp !== undefined;
        return [result.items ?? [], hasMore];
    }
    loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        return this.loadMoreStatuses(token, userAlias, pageSize, lastItem, this.feedDAO.getFeed.bind(this.feedDAO));
    }
    loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        return this.loadMoreStatuses(token, userAlias, pageSize, lastItem, this.statusDAO.getStory.bind(this.statusDAO));
    }
    async postStatus(token, newStatus) {
        await this.validateToken(token);
        await this.statusDAO.postStatus(newStatus);
        const followers = await this.followDAO.getFollowers(newStatus.user.alias, 10000);
        await this.feedDAO.addStatusToFeeds(followers, newStatus);
    }
}
exports.StatusService = StatusService;
