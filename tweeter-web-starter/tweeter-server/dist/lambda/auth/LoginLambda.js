"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const service = new UserService_1.UserService();
    try {
        const [user, token] = await service.login(request.alias, request.password);
        return {
            success: true,
            message: null,
            user,
            authToken: token,
        };
    }
    catch (e) {
        return {
            success: false,
            message: e.message,
            user: null,
            authToken: null,
        };
    }
};
exports.handler = handler;
