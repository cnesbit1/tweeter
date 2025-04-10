"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const service = new UserService_1.UserService();
    try {
        const user = await service.getUser(request.token, request.alias);
        return {
            success: true,
            user: user,
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
