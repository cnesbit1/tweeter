import { AuthToken } from '../../../tweeter-shared';
import { UserService } from '../model/service/UserService';
import { MessageView, Presenter } from './Presenter';

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  getAuthToken: () => AuthToken | null;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView, UserService> {
  protected createService() {
    return new UserService();
  }

  public async logOut(): Promise<void> {
    this.doFailureReportingOperation(
      async () => {
        this.view.displayInfoMessage('Logging Out...', 0);
        await this.service.logout(this.view.getAuthToken()!);
        this.view.clearUserInfo();
        this.view.clearLastInfoMessage();
        this.view.displayInfoMessage('Successfully logged out!', 3000);
      },
      'log user out',
      () => {}
    );
  }
}
