import './UserInfo.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserInfoPresenter,
  UserInfoView,
} from '../../presenters/userInteraction/UserInfoPresenter';
import useUserInfo from './UserInfoHook';
import useToastListener from '../toaster/ToastListenerHook';

const UserInfo = () => {
  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const view: UserInfoView = {
    setIsFollower,
    setFolloweeCount,
    setFollowerCount,
    setIsLoading,
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage,
    getCurrentUser: () => currentUser!,
    getDisplayedUser: () => displayedUser!,
    setDisplayedUser,
  };

  const presenter = new UserInfoPresenter(view);

  useEffect(() => {
    presenter.loadUserInfo(authToken!);
  }, [displayedUser]);

  return (
    <div className={isLoading ? 'loading' : ''}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="User"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{' '}
                  <Link
                    to={''}
                    onClick={(event) => presenter.switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: '6em' }}
                      onClick={(event) =>
                        presenter.unfollowDisplayedUser(authToken!, event)
                      }
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: '6em' }}
                      onClick={(event) =>
                        presenter.followDisplayedUser(authToken!, event)
                      }
                    >
                      {isLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
