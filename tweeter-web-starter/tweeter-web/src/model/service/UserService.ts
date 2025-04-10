import { AuthToken, User } from 'tweeter-shared';
import { Service } from './Service';

export class UserService extends Service {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const response = await this.serverFacade.getUser(authToken.token, alias);
    return response.success ? User.fromDto(response.user ?? null) : null;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const response = await this.serverFacade.login(alias, password);
    const user = User.fromDto(response.user);
    if (!user) {
      throw new Error('Login failed: invalid user data');
    }

    if (!response.authToken) {
      throw new Error('Login failed: no authToken');
    }

    const token = new AuthToken(response.authToken, Date.now());
    return [user, token];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.serverFacade.logout(authToken.token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const response = await this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension,
    });

    const user = User.fromDto(response.user);

    if (!user) {
      throw new Error('Login failed: invalid user data');
    }

    if (!response.authToken) {
      throw new Error('Login failed: no authToken');
    }

    const token = new AuthToken(response.authToken, Date.now());
    return [user, token];
  }
}
