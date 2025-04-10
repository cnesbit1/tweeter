"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const service = new FollowService_1.FollowService();
    try {
        const [followerCount, followeeCount] = await service.followUser(request.token, request.user);
        return {
            success: true,
            message: null,
            followerCount,
            followeeCount,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            followerCount: 0,
            followeeCount: 0,
        };
    }
};
exports.handler = handler;
