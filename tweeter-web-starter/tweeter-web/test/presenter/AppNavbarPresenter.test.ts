import { AuthToken } from '../../../tweeter-shared';
import {
  AppNavbarPresenter,
  AppNavbarView,
} from '../../src/presenters/AppNavbarPresenter';
import {
  mock,
  instance,
  verify,
  spy,
  when,
  anything,
} from '@typestrong/ts-mockito';
import { UserService } from '../../src/model/service/UserService';

describe('AppNavBarPresenter', () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavBarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken('abc123', Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    const AppNavBarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarViewInstance)
    );
    appNavBarPresenter = instance(AppNavBarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(mockAppNavbarView.getAuthToken()).thenReturn(authToken);
    when(AppNavBarPresenterSpy.service).thenReturn(mockUserServiceInstance);
  });

  it('tells the view to display a logging out message', async () => {
    await appNavBarPresenter.logOut();
    verify(mockAppNavbarView.displayInfoMessage('Logging Out...', 0)).once();
  });

  it('calls logout on the user service with the correct auth token', async () => {
    await appNavBarPresenter.logOut();
    verify(mockUserService.logout(authToken)).once();
  });

  it('tells the view to clear the last info message and clear the user info', async () => {
    await appNavBarPresenter.logOut();
    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
  });

  it('tells the view to display an error message and does not tell it to clear the last info message or clear the user info', async () => {
    const error = new Error('error');
    when(mockUserService.logout(authToken)).thenThrow(error);
    await appNavBarPresenter.logOut();

    verify(
      mockAppNavbarView.displayErrorMessage(
        `Failed to log user out because of exception: Error: error`
      )
    ).once();

    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
  });
});
