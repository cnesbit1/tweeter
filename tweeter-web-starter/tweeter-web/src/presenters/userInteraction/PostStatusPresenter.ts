import { AuthToken, Status } from '../../../../tweeter-shared';
import { StatusService } from '../../model/service/StatusService';
import {
  UserInteractionPresenter,
  UserInteractionView,
} from './UserInteractionPresenter';

export interface PostStatusView extends UserInteractionView {
  setPost: (content: string) => void;
  getAuthToken: () => AuthToken;
  getPostContent: () => string;
}

export class PostStatusPresenter extends UserInteractionPresenter<
  PostStatusView,
  StatusService
> {
  protected createService(): StatusService {
    return new StatusService();
  }

  public async submitPost(event: React.MouseEvent, postContent: string, currentUser: any) {
    await this.executeWithFeedback(
      'Posting status',
      0,
      async () => {
        const status = new Status(
          postContent,
          currentUser,
          Date.now()
        );

        await this.service.postStatus(this.view.getAuthToken(), status);

        this.view.setPost('');
        this.view.displayInfoMessage('Status posted!', 2000);
      },
      'post the status',
      event
    );
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost('');
  }

  public checkButtonStatus(): boolean {
    return (
      !this.view.getPostContent().trim() ||
      !this.view.getAuthToken() ||
      !this.view.getCurrentUser()
    );
  }
}
