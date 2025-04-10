import { IAuthTokenDAO } from '../interfaces/IAuthTokenDAO';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamo = new AWS.DynamoDB.DocumentClient();
const AUTHTOKENS_TABLE = 'AuthToken';
const TOKEN_TTL_SECONDS = 3600;

export class AuthTokenDynamoDAO implements IAuthTokenDAO {
  async generateToken(alias: string): Promise<string> {
    const token = uuidv4();
    const expiration = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

    const params = {
      TableName: AUTHTOKENS_TABLE,
      Item: {
        token: token,
        alias: alias,
        ttl: expiration,
      },
    };

    await dynamo.put(params).promise();
    return token;
  }

  async isValidToken(token: string): Promise<boolean> {
    const params = {
      TableName: AUTHTOKENS_TABLE,
      Key: {
        token: token,
      },
    };

    const result = await dynamo.get(params).promise();
    return !!result.Item;
  }

  async deleteToken(token: string): Promise<void> {
    const params = {
      TableName: AUTHTOKENS_TABLE,
      Key: {
        token: token,
      },
    };

    await dynamo.delete(params).promise();
  }

  async getAliasForToken(token: string): Promise<string> {
    const result = await dynamo
      .get({
        TableName: AUTHTOKENS_TABLE,
        Key: { token },
      })
      .promise();

    if (!result.Item) throw new Error('Token not found');
    return result.Item.alias;
  }
}
