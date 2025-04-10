import { IUserDAO } from '../interfaces/IUserDAO';
import { UserDto } from 'tweeter-shared';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';

const dynamo = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'Users';

export class UserDynamoDAO implements IUserDAO {
  async getUserByAlias(alias: string): Promise<UserDto | null> {
    const params = {
      TableName: USERS_TABLE,
      Key: {
        alias: alias,
      },
    };

    const result = await dynamo.get(params).promise();
    return (result.Item as UserDto) ?? null;
  }

  async createUser(user: UserDto, hashedPassword: string): Promise<void> {
    const existingUser = await this.getUserByAlias(user.alias);
    if (existingUser) {
      throw new Error('Alias already taken');
    }

    const params = {
      TableName: USERS_TABLE,
      Item: {
        ...user,
        hashedPassword: hashedPassword,
      },
    };

    await dynamo.put(params).promise();
  }

  async validateCredentials(
    alias: string,
    plainTextPassword: string
  ): Promise<boolean> {
    const params = {
      TableName: USERS_TABLE,
      Key: {
        alias: alias,
      },
      ProjectionExpression: 'hashedPassword',
    };

    const result = await dynamo.get(params).promise();
    const storedHash = result.Item?.hashedPassword;

    if (!storedHash) {
      return false;
    }

    return bcrypt.compareSync(plainTextPassword, storedHash);
  }
}
