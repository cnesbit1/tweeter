"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const DynamoDAOFactory_1 = require("../dao/DynamoDAOFactory");
class Service {
    authTokenDAO = DynamoDAOFactory_1.DynamoDAOFactory.getAuthTokenDAO();
    async validateToken(token) {
        const isValid = await this.authTokenDAO.isValidToken(token);
        if (!isValid) {
            throw new Error('Invalid or expired token');
        }
    }
}
exports.Service = Service;
