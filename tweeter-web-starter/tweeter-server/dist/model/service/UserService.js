"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const DynamoDAOFactory_1 = require("../dao/DynamoDAOFactory");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const buffer_1 = require("buffer");
const Service_1 = require("./Service");
class UserService extends Service_1.Service {
    userDAO = DynamoDAOFactory_1.DynamoDAOFactory.getUserDAO();
    imageDAO = DynamoDAOFactory_1.DynamoDAOFactory.getImageDAO();
    async getUser(token, alias) {
        await this.validateToken(token);
        return await this.userDAO.getUserByAlias(alias);
    }
    async login(alias, password) {
        const isValid = await this.userDAO.validateCredentials(alias, password);
        if (!isValid) {
            throw new Error('Invalid alias or password');
        }
        const user = await this.userDAO.getUserByAlias(alias);
        if (!user)
            throw new Error('User not found');
        const token = await this.authTokenDAO.generateToken(alias);
        return [user, token];
    }
    async logout(token) {
        await this.authTokenDAO.deleteToken(token);
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const imageBase64 = buffer_1.Buffer.from(userImageBytes).toString('base64');
        const imageUrl = await this.imageDAO.uploadProfileImage(alias, imageBase64, imageFileExtension);
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const newUser = {
            firstName,
            lastName,
            alias,
            imageUrl,
        };
        await this.userDAO.createUser(newUser, hashedPassword);
        const token = await this.authTokenDAO.generateToken(alias);
        return [newUser, token];
    }
}
exports.UserService = UserService;
