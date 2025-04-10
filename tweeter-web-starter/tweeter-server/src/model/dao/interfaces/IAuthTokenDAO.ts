export interface IAuthTokenDAO {
  generateToken(alias: string): Promise<string>;

  isValidToken(token: string): Promise<boolean>;

  deleteToken(token: string): Promise<void>;

  getAliasForToken(token: string): Promise<string>;
}
