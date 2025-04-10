import { DynamoDAOFactory } from '../dao/DynamoDAOFactory';

export abstract class Service {
  protected authTokenDAO = DynamoDAOFactory.getAuthTokenDAO();

  protected async validateToken(token: string): Promise<void> {
    const isValid = await this.authTokenDAO.isValidToken(token);
    if (!isValid) {
      throw new Error('Invalid or expired token');
    }
  }

}
