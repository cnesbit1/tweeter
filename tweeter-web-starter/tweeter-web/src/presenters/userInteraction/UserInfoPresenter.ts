import { AuthToken } from '../../../../tweeter-shared';
import { FollowService } from '../../model/service/FollowService';
import {
  UserInteractionPresenter,
  UserInteractionView,
} from './UserInteractionPresenter';

export interface UserInfoView extends UserInteractionView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  getDisplayedUser: () => any;
  setDisplayedUser: (user: any) => void;
}

export class UserInfoPresenter extends UserInteractionPresenter<
  UserInfoView,
  FollowService
> {
  protected createService() {
    return new FollowService();
  }

  public async loadUserInfo(authToken: AuthToken) {
    this.doFailureReportingOperation(
      async () => {
        const currentUser = this.view.getCurrentUser();
        const displayedUser = this.view.getDisplayedUser();

        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          const isFollower = await this.service.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser
          );
          this.view.setIsFollower(isFollower);
        }

        const followeeCount = await this.service.getFolloweeCount(
          authToken,
          displayedUser
        );
        const followerCount = await this.service.getFollowerCount(
          authToken,
          displayedUser
        );

        this.view.setFolloweeCount(followeeCount);
        this.view.setFollowerCount(followerCount);
      },
      'load user info',
      () => {}
    );
  }

  public switchToLoggedInUser(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setDisplayedUser(this.view.getCurrentUser());
  }

  private async modifyFollowStatus(
    authToken: AuthToken,
    followOperation: (
      authToken: AuthToken,
      user: any
    ) => Promise<[number, number]>,
    isFollowing: boolean,
    event: React.MouseEvent
  ) {
    const displayedUser = this.view.getDisplayedUser();
    const action = isFollowing ? 'Following' : 'Unfollowing';
    const actionDescription = `${action} ${displayedUser.name}`;
    const errorDescription = isFollowing ? 'follow user' : 'unfollow user';

    await this.executeWithFeedback(
      actionDescription,
      3000,
      async () => {
        const [followerCount, followeeCount] = await followOperation(
          authToken,
          displayedUser
        );

        this.view.setIsFollower(isFollowing);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      errorDescription,
      event
    );
  }

  public followDisplayedUser(authToken: AuthToken, event: React.MouseEvent) {
    return this.modifyFollowStatus(
      authToken,
      (token, user) => this.service.followUser(token, user),
      true,
      event
    );
  }

  public unfollowDisplayedUser(authToken: AuthToken, event: React.MouseEvent) {
    return this.modifyFollowStatus(
      authToken,
      (token, user) => this.service.unfollowUser(token, user),
      false,
      event
    );
  }
}
