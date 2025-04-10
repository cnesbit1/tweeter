import {
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
  AuthAliasRequest,
  AuthUserRequest,
  PagedItemRequest,
  IsFollowerStatusRequest,
  PostStatusRequest,
  CountResponse,
  FollowCountResponse,
  IsFollowerStatusResponse,
  UserSessionResponse,
  TweeterResponse,
  GetUserResponse,
  PagedItemResponse,
  UserDto,
  StatusDto,
} from 'tweeter-shared';

import { ClientCommunicator } from './ClientCommunicator';

export class ServerFacade {
  private communicator = new ClientCommunicator();

  async login(alias: string, password: string): Promise<UserSessionResponse> {
    return this.communicator.doPost<LoginRequest, UserSessionResponse>(
      { alias: alias, password: password },
      '/login'
    );
  }

  async logout(token: string): Promise<TweeterResponse> {
    return this.communicator.doPost<LogoutRequest, TweeterResponse>(
      { token: token },
      '/logout'
    );
  }

  async register(req: RegisterRequest): Promise<UserSessionResponse> {
    return this.communicator.doPost<RegisterRequest, UserSessionResponse>(
      req,
      '/register'
    );
  }

  async getUser(token: string, alias: string): Promise<GetUserResponse> {
    return this.communicator.doPost<AuthAliasRequest, GetUserResponse>(
      { token: token, alias: alias },
      '/getuser'
    );
  }

  async getMoreFollowees(
    req: PagedItemRequest<UserDto>
  ): Promise<PagedItemResponse<UserDto>> {
    return this.communicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(req, '/followee/list');
  }

  async getMoreFollowers(
    req: PagedItemRequest<UserDto>
  ): Promise<PagedItemResponse<UserDto>> {
    return this.communicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(req, '/follower/list');
  }

  async getFolloweeCount(req: AuthAliasRequest): Promise<CountResponse> {
    return this.communicator.doPost<AuthAliasRequest, CountResponse>(
      req,
      '/followee/count'
    );
  }

  async getFollowerCount(req: AuthAliasRequest): Promise<CountResponse> {
    return this.communicator.doPost<AuthAliasRequest, CountResponse>(
      req,
      '/follower/count'
    );
  }

  async followUser(req: AuthUserRequest): Promise<FollowCountResponse> {
    return this.communicator.doPost<AuthUserRequest, FollowCountResponse>(
      req,
      '/follow'
    );
  }

  async unfollowUser(req: AuthUserRequest): Promise<FollowCountResponse> {
    return this.communicator.doPost<AuthUserRequest, FollowCountResponse>(
      req,
      '/unfollow'
    );
  }

  async isFollower(
    req: IsFollowerStatusRequest
  ): Promise<IsFollowerStatusResponse> {
    return this.communicator.doPost<
      IsFollowerStatusRequest,
      IsFollowerStatusResponse
    >(req, '/follower/isfollower');
  }

  // Status
  async postStatus(req: PostStatusRequest): Promise<TweeterResponse> {
    return this.communicator.doPost<PostStatusRequest, TweeterResponse>(
      req,
      '/status/post'
    );
  }

  async getStory(
    req: PagedItemRequest<StatusDto>
  ): Promise<PagedItemResponse<StatusDto>> {
    return this.communicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(req, '/status/stories');
  }

  async getFeed(
    req: PagedItemRequest<StatusDto>
  ): Promise<PagedItemResponse<StatusDto>> {
    return this.communicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(req, '/status/feeds');
  }
}
