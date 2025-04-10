export interface IFollowDAO {
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;

  getFollowers(
    alias: string,
    limit: number,
    lastFollowerAlias?: string
  ): Promise<string[]>;
  getFollowees(
    alias: string,
    limit: number,
    lastFolloweeAlias?: string
  ): Promise<string[]>;

  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;

  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}
