import { UserDto } from 'tweeter-shared';
import { DynamoDAOFactory } from '../dao/DynamoDAOFactory';
import bcrypt from 'bcryptjs';
import { Buffer } from 'buffer';
import { Service } from './Service';

export class UserService extends Service {
  private userDAO = DynamoDAOFactory.getUserDAO();
  private imageDAO = DynamoDAOFactory.getImageDAO();

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.validateToken(token)
    return await this.userDAO.getUserByAlias(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    const isValid = await this.userDAO.validateCredentials(alias, password);
    if (!isValid) {
      throw new Error('Invalid alias or password');
    }

    const user = await this.userDAO.getUserByAlias(alias);
    if (!user) throw new Error('User not found');

    const token = await this.authTokenDAO.generateToken(alias);
    return [user, token];
  }

  public async logout(token: string): Promise<void> {
    await this.authTokenDAO.deleteToken(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    // const imageBase64 = Buffer.from(userImageBytes).toString('base64');
    const imageUrl = await this.imageDAO.uploadProfileImage(
      alias,
      userImageBytes,
      imageFileExtension
    );

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser: UserDto = {
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
