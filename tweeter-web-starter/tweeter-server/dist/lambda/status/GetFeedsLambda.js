"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    try {
        const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
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
