"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const service = new UserService_1.UserService();
    try {
        await service.logout(request.token);
        return {
            success: true,
            message: 'Successful Logout',
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
