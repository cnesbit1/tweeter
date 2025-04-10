import './PostStatus.css';
import { useState } from 'react';
import {
  PostStatusPresenter,
  PostStatusView,
} from '../../presenters/userInteraction/PostStatusPresenter';
import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from '../userInfo/UserInfoHook';

interface Props {
  presenter?: PostStatusPresenter;
}
const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const view: PostStatusView = {
    setPost,
    setIsLoading,
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage,
    getAuthToken: () => authToken!,
    getCurrentUser: () => currentUser!,
    getPostContent: () => post,
  };

  const presenter = props.presenter ?? new PostStatusPresenter(view);

  return (
    <div className={isLoading ? 'loading' : ''}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            id="postStatusTextArea"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            aria-label="submission"
            onChange={(event) => setPost(event.target.value)}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={presenter.checkButtonStatus()}
            style={{ width: '8em' }}
            onClick={(event) => presenter.submitPost(event, view.getPostContent(), view.getCurrentUser())}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
            className="btn btn-md btn-secondary"
            type="button"
            disabled={presenter.checkButtonStatus()}
            onClick={(event) => presenter.clearPost(event)}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
