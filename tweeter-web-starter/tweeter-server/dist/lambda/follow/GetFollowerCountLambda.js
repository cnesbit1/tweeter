"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const service = new FollowService_1.FollowService();
    try {
        const count = await service.getFollowerCount(request.token, request.alias);
        return {
            success: true,
            message: null,
            count,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            count: 0,
        };
    }
};
exports.handler = handler;
