"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const DynamoDAOFactory_1 = require("../dao/DynamoDAOFactory");
const Service_1 = require("./Service");
class FollowService extends Service_1.Service {
    followDAO = DynamoDAOFactory_1.DynamoDAOFactory.getFollowDAO();
    userDAO = DynamoDAOFactory_1.DynamoDAOFactory.getUserDAO();
    async loadMoreItems(token, userAlias, pageSize, lastItem, fetchAliases) {
        await this.validateToken(token);
        const lastAlias = lastItem?.alias;
        const aliases = await fetchAliases(userAlias, pageSize, lastAlias);
        const users = await Promise.all(aliases.map((a) => this.userDAO.getUserByAlias(a)));
        const userDtos = users.filter((u) => u !== null);
        return [userDtos, aliases.length === pageSize];
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        return this.loadMoreItems(token, userAlias, pageSize, lastItem, this.followDAO.getFollowers);
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        return this.loadMoreItems(token, userAlias, pageSize, lastItem, this.followDAO.getFollowees);
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        await this.validateToken(token);
        const currentUserAlias = await this.authTokenDAO.getAliasForToken(token);
        return this.followDAO.isFollower(currentUserAlias, selectedUser.alias);
    }
    async getFolloweeCount(token, alias) {
        await this.validateToken(token);
        return this.followDAO.getFolloweeCount(alias);
    }
    async getFollowerCount(token, alias) {
        await this.validateToken(token);
        return this.followDAO.getFollowerCount(alias);
    }
    async modifyFollowRelationship(token, targetUser, action) {
        await this.validateToken(token);
        const currentUserAlias = await this.authTokenDAO.getAliasForToken(token);
        await action(currentUserAlias, targetUser.alias);
        const followerCount = await this.followDAO.getFollowerCount(targetUser.alias);
        const followeeCount = await this.followDAO.getFolloweeCount(currentUserAlias);
        return [followerCount, followeeCount];
    }
    followUser(token, userToFollow) {
        return this.modifyFollowRelationship(token, userToFollow, this.followDAO.follow.bind(this.followDAO));
    }
    unfollowUser(token, userToUnfollow) {
        return this.modifyFollowRelationship(token, userToUnfollow, this.followDAO.unfollow.bind(this.followDAO));
    }
}
exports.FollowService = FollowService;
