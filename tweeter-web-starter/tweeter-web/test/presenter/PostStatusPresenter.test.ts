import { AuthToken, Status, User } from '../../../tweeter-shared';
import {
  PostStatusPresenter,
  PostStatusView,
} from '../../src/presenters/userInteraction/PostStatusPresenter';
import {
  mock,
  instance,
  verify,
  spy,
  when,
  anything,
  capture,
} from '@typestrong/ts-mockito';
import { StatusService } from '../../src/model/service/StatusService';

describe('PostStatusPresenter', () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;
  let mockEvent: React.MouseEvent;

  const authToken = new AuthToken('abc123', Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(mockPostStatusView.getAuthToken()).thenReturn(authToken);
    when(mockPostStatusView.getPostContent()).thenReturn('Mocked post content');
    when(mockPostStatusView.getCurrentUser()).thenReturn(
      new User('1', 'First', 'Last', 'ImageURL')
    );
    when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
    when(mockStatusService.postStatus(anything(), anything())).thenResolve();

    mockEvent = mock<React.MouseEvent>();
  });

  it('tells the view to display a posting status message', async () => {
    await postStatusPresenter.submitPost(
      mockEvent,
      'Mocked post content',
      new User('1', 'First', 'Last', 'ImageURL')
    );
    verify(
      mockPostStatusView.displayInfoMessage('Posting status...', 0)
    ).once();
  });

  it('calls postStatus on the post status service with the correct status string and auth token', async () => {
    await postStatusPresenter.submitPost(
      mockEvent,
      'Mocked post content',
      new User('1', 'First', 'Last', 'ImageURL')
    );
    const [_, capturedStatus] = capture(mockStatusService.postStatus).last();

    expect(capturedStatus).toBeInstanceOf(Status);
    expect(capturedStatus.post).toBe('Mocked post content');
    expect(capturedStatus.user).toEqual(
      new User('1', 'First', 'Last', 'ImageURL')
    );

    verify(mockStatusService.postStatus(authToken, capturedStatus)).once();
  });

  it('tells the view to clear the last info message, clear the post, and display a status posted message', async () => {
    await postStatusPresenter.submitPost(
      mockEvent,
      'Mocked post content',
      new User('1', 'First', 'Last', 'ImageURL')
    );
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost('')).once();
    verify(
      mockPostStatusView.displayInfoMessage('Status posted!', 2000)
    ).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it('tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message', async () => {
    const error = new Error('error');
    when(mockStatusService.postStatus(anything(), anything())).thenReject(
      error
    );

    await postStatusPresenter.submitPost(
      mockEvent,
      'Mocked post content',
      new User('1', 'First', 'Last', 'ImageURL')
    );
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: Error: error`
      )
    ).once();
    verify(
      mockPostStatusView.displayInfoMessage('Status posted!', 2000)
    ).never();
    verify(mockPostStatusView.setPost('')).never();
  });
});
