import { User, UserDto } from '../../../../tweeter-shared';
import { PagedItemPresenter, PagedItemView } from './PagedItemPresenter';
import { FollowService } from '../../model/service/FollowService';

export interface UserItemView extends PagedItemView<User> {}

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }

  public getItemKey(user: UserDto): string {
    return user.alias;
  }
}
