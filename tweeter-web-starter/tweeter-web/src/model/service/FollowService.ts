import {
  AuthToken,
  User,
  UserDto,
  AuthUserRequest,
  AuthAliasRequest,
  IsFollowerStatusRequest,
  PagedItemRequest,
  FollowCountResponse,
  CountResponse,
  IsFollowerStatusResponse,
  PagedItemResponse,
} from 'tweeter-shared';
import { ServerFacade } from '../../network/ServerFacade';
import { Service } from './Service';

export class FollowService extends Service {
  // private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null,
    };

    const response: PagedItemResponse<UserDto> =
      await this.serverFacade.getMoreFollowers(request);

    const users = (response.items ?? []).map((dto) => User.fromDto(dto)!);
    return [users, response.hasMore];
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem?.dto ?? null,
    };

    const response: PagedItemResponse<UserDto> =
      await this.serverFacade.getMoreFollowees(request);

    const users = (response.items ?? []).map((dto) => User.fromDto(dto)!);
    return [users, response.hasMore];
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: IsFollowerStatusRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };

    const response: IsFollowerStatusResponse =
      await this.serverFacade.isFollower(request);
    return response.isFollower;
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: AuthAliasRequest = {
      token: authToken.token,
      alias: user.alias,
    };

    const response: CountResponse = await this.serverFacade.getFolloweeCount(
      request
    );
    return response.count;
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: AuthAliasRequest = {
      token: authToken.token,
      alias: user.alias,
    };

    const response: CountResponse = await this.serverFacade.getFollowerCount(
      request
    );
    return response.count;
  }

  public async followUser(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    const request: AuthUserRequest = {
      token: authToken.token,
      user: userToFollow.dto,
    };

    const response: FollowCountResponse = await this.serverFacade.followUser(
      request
    );

    return [response.followerCount, response.followeeCount];
  }

  public async unfollowUser(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[number, number]> {
    const request: AuthUserRequest = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };

    const response: FollowCountResponse = await this.serverFacade.unfollowUser(
      request
    );

    return [response.followerCount, response.followeeCount];
  }
}
