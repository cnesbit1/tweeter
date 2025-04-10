import { IUserDAO } from './interfaces/IUserDAO';
import { IAuthTokenDAO } from './interfaces/IAuthTokenDAO';
import { IImageDAO } from './interfaces/IImageDAO';
import { IFollowDAO } from './interfaces/IFollowDAO';
import { IFeedDAO } from './interfaces/IFeedDAO';
import { IStatusDAO } from './interfaces/IStatusDAO';

import { UserDynamoDAO } from './dynamo/UserDynamoDAO';
import { AuthTokenDynamoDAO } from './dynamo/AuthTokenDynamoDAO';
import { S3ImageDAO } from './dynamo/S3ImageDAO';
import { FollowDynamoDAO } from './dynamo/FollowDynamoDAO';
import { FeedDynamoDAO } from './dynamo/FeedDynamoDAO';
import { StatusDynamoDAO } from './dynamo/StatusDynamoDAO';

export class DynamoDAOFactory {
  static getUserDAO(): IUserDAO {
    return new UserDynamoDAO();
  }

  static getAuthTokenDAO(): IAuthTokenDAO {
    return new AuthTokenDynamoDAO();
  }

  static getImageDAO(): IImageDAO {
    return new S3ImageDAO();
  }

  static getFollowDAO(): IFollowDAO {
    return new FollowDynamoDAO();
  }

  static getFeedDAO(): IFeedDAO {
    return new FeedDynamoDAO();
  }

  static getStatusDAO(): IStatusDAO {
    return new StatusDynamoDAO();
  }
}
