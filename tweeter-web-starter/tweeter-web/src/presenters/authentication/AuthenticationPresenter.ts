import { AuthToken, User } from '../../../../tweeter-shared';
import { UserService } from '../../model/service/UserService';
import { Presenter, View } from '../Presenter';

export interface AuthenticationView extends View {
  setIsLoading: (loading: boolean) => void;
  getRememberMe: () => boolean;
  getPassword: () => string;
  getAlias: () => string;
  updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
}

export abstract class AuthenticationPresenter<
  V extends AuthenticationView
> extends Presenter<V, UserService> {
  protected createService() {
    return new UserService();
  }

  public onEnter(
    event: React.KeyboardEvent<HTMLElement>,
    handleEnter: () => void
  ) {
    if (event.key === 'Enter' && !this.checkSubmitButtonStatus()) {
      handleEnter();
    }
  }

  public async doAccess(): Promise<boolean> {
    this.view.setIsLoading(true);
    let value: boolean = false;

    await this.doFailureReportingOperation(
      async () => {
        const [user, authToken] = await this.serviceOperation();

        this.view.updateUserInfo(
          user,
          user,
          authToken,
          this.view.getRememberMe()
        );

        value = true;
      },
      this.getItemDescription(),
      () => {
        this.view.setIsLoading(false);
      }
    );
    return value;
  }

  public abstract serviceOperation(): Promise<[User, AuthToken]>;
  public abstract getItemDescription(): string;
  public abstract checkSubmitButtonStatus(): boolean;
}
