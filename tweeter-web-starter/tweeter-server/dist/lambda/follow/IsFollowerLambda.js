"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const service = new FollowService_1.FollowService();
    try {
        const isFollower = await service.getIsFollowerStatus(request.token, request.user, request.selectedUser);
        return {
            success: true,
            message: null,
            isFollower,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            isFollower: false,
        };
    }
};
exports.handler = handler;
