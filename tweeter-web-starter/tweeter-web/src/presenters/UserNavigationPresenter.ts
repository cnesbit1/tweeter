import { AuthToken, User } from '../../../tweeter-shared';
import { UserService } from '../model/service/UserService';
import { Presenter, View } from './Presenter';

export interface UserNavigationView extends View {
  getCurrentUser: () => User;
}

export class UserNavigationPresenter extends Presenter<
  UserNavigationView,
  UserService
> {
  protected createService() {
    return new UserService();
  }

  public async getUser(
    authToken: AuthToken,
    event: React.MouseEvent
  ): Promise<User | null> {
    event.preventDefault();

    let result = await this.doFailureReportingOperation<User | null>(
      async () => {
        const alias = this.extractAlias(event.target.toString());
        const user = await this.service.getUser(authToken, alias);

        if (!!user) {
          const currentUser = this.view.getCurrentUser();
          return currentUser.equals(user) ? currentUser : user;
        }

        return null;
      },
      'get user',
      () => {}
    );

    return result ?? null;
  }

  private extractAlias(value: string): string {
    const index = value.indexOf('@');
    if (index === -1) throw new Error('Invalid username format');
    return value.substring(index);
  }
}
