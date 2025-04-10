import './App.css';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Login from './components/authentication/login/Login';
import Register from './components/authentication/register/Register';
import MainLayout from './components/mainLayout/MainLayout';
import Toaster from './components/toaster/Toaster';
import useUserInfo from './components/userInfo/UserInfoHook';
import { FolloweePresenter } from './presenters/mainLayout/FolloweePresenter';
import { FollowerPresenter } from './presenters/mainLayout/FollowerPresenter';
import {
  UserItemPresenter,
  UserItemView,
} from './presenters/mainLayout/UserItemPresenter';
import { StoryPresenter } from './presenters/mainLayout/StoryPresenter';
import {
  StatusItemPresenter,
  StatusItemView,
} from './presenters/mainLayout/StatusItemPresenter';
import { FeedPresenter } from './presenters/mainLayout/FeedPresenter';
import ItemScroller from './components/mainLayout/ItemScroller';
import { Status, User } from '../../tweeter-shared';
import StatusItem from './components/statusItem/StatusItem';
import { StatusService } from './model/service/StatusService';
import UserItem from './components/userItem/UserItem';
import { FollowService } from './model/service/FollowService';

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller<
              Status,
              StatusItemView,
              StatusItemPresenter,
              StatusService
            >
              key={1}
              presenterGenerator={(view: StatusItemView) =>
                new FeedPresenter(view)
              }
              ItemComponent={StatusItem}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<
              Status,
              StatusItemView,
              StatusItemPresenter,
              StatusService
            >
              key={2}
              presenterGenerator={(view: StatusItemView) =>
                new StoryPresenter(view)
              }
              ItemComponent={StatusItem}
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, UserItemView, UserItemPresenter, FollowService>
              key={3}
              presenterGenerator={(view: UserItemView) =>
                new FolloweePresenter(view)
              }
              ItemComponent={UserItem}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, UserItemView, UserItemPresenter, FollowService>
              key={4}
              presenterGenerator={(view: UserItemView) =>
                new FollowerPresenter(view)
              }
              ItemComponent={UserItem}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
