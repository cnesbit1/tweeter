"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    try {
        const [items, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
        return {
            success: true,
            message: null,
            items,
            hasMore,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            items: [],
            hasMore: false,
        };
    }
};
exports.handler = handler;
