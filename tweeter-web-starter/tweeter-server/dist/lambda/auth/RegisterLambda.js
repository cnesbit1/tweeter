"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const service = new UserService_1.UserService();
    try {
        const [userDto, authToken] = await service.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
        return {
            success: true,
            message: null,
            user: userDto,
            authToken: authToken,
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
