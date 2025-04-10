"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (request) => {
    const service = new StatusService_1.StatusService();
    try {
        await service.postStatus(request.token, request.status);
        return {
            success: true,
            message: null,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
        };
    }
};
exports.handler = handler;
