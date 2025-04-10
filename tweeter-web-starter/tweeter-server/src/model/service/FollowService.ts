import { UserDto } from 'tweeter-shared';
import { DynamoDAOFactory } from '../dao/DynamoDAOFactory';
import { Service } from './Service';

export class FollowService extends Service {
  private followDAO = DynamoDAOFactory.getFollowDAO();
  private userDAO = DynamoDAOFactory.getUserDAO();

  public async loadMoreItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    fetchAliases: (
      alias: string,
      pageSize: number,
      lastKey?: string
    ) => Promise<string[]>
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(token);

    const lastAlias = lastItem?.alias;
    const aliases = await fetchAliases(userAlias, pageSize, lastAlias);

    const users = await Promise.all(
      aliases.map((a) => this.userDAO.getUserByAlias(a))
    );

    const userDtos = users.filter((u): u is UserDto => u !== null);

    return [userDtos, aliases.length === pageSize];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreItems(
      token,
      userAlias,
      pageSize,
      lastItem,
      this.followDAO.getFollowers
    );
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreItems(
      token,
      userAlias,
      pageSize,
      lastItem,
      this.followDAO.getFollowees
    );
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.validateToken(token);
    const currentUserAlias = await this.authTokenDAO.getAliasForToken(token);
    return this.followDAO.isFollower(currentUserAlias, selectedUser.alias);
  }

  public async getFolloweeCount(token: string, alias: string): Promise<number> {
    await this.validateToken(token);
    return this.followDAO.getFolloweeCount(alias);
  }

  public async getFollowerCount(token: string, alias: string): Promise<number> {
    await this.validateToken(token);
    return this.followDAO.getFollowerCount(alias);
  }

  private async modifyFollowRelationship(
    token: string,
    targetUser: UserDto,
    action: (followerAlias: string, followeeAlias: string) => Promise<void>
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.validateToken(token);
    const currentUserAlias = await this.authTokenDAO.getAliasForToken(token);

    await action(currentUserAlias, targetUser.alias);

    const followerCount = await this.followDAO.getFollowerCount(
      targetUser.alias
    );
    const followeeCount = await this.followDAO.getFolloweeCount(
      currentUserAlias
    );

    return [followerCount, followeeCount];
  }

  public followUser(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    return this.modifyFollowRelationship(
      token,
      userToFollow,
      this.followDAO.follow.bind(this.followDAO)
    );
  }

  public unfollowUser(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    return this.modifyFollowRelationship(
      token,
      userToUnfollow,
      this.followDAO.unfollow.bind(this.followDAO)
    );
  }
}
