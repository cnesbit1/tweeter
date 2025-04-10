import { User, AuthToken } from '../../../../tweeter-shared';
import {
  AuthenticationPresenter,
  AuthenticationView,
} from './AuthenticationPresenter';

export interface LoginView extends AuthenticationView {
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public checkSubmitButtonStatus(): boolean {
    return !this.view.getAlias() || !this.view.getPassword();
  }

  public async serviceOperation(): Promise<[User, AuthToken]> {
    return await this.service.login(
      this.view.getAlias(),
      this.view.getPassword()
    );
  }

  public getItemDescription(): string {
    return 'log in';
  }
}
