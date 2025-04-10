import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from '../userInfo/UserInfoHook';
import {
  UserNavigationPresenter,
  UserNavigationView,
} from '../../presenters/UserNavigationPresenter';

const useNavigateToUser = () => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const view: UserNavigationView = {
    displayErrorMessage,
    getCurrentUser: () => currentUser!,
  };

  const presenter = new UserNavigationPresenter(view);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    const user = await presenter.getUser(authToken!, event);
    if (user) {
      setDisplayedUser(user);
    }
  };

  return { navigateToUser };
};

export default useNavigateToUser;
