import { UserDto } from 'tweeter-shared';

export interface IUserDAO {
  getUserByAlias(alias: string): Promise<UserDto | null>;

  createUser(user: UserDto, hashedPassword: string): Promise<void>;

  validateCredentials(
    alias: string,
    plainTextPassword: string
  ): Promise<boolean>;
}
