import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import PostStatus from '../../../src/components/postStatus/PostStatus';
import {
  PostStatusPresenter,
  PostStatusView,
} from '../../../src/presenters/userInteraction/PostStatusPresenter';
import { mock, instance, verify, capture } from '@typestrong/ts-mockito';
import useUserInfo from '../../../src/components/userInfo/UserInfoHook';
import { AuthToken, User } from '../../../../tweeter-shared';

library.add(fab);

jest.mock('../../../src/components/userInfo/UserInfoHook', () => ({
  ...jest.requireActual('../../../src/components/userInfo/UserInfoHook'),
  __esModule: true,
  default: jest.fn(),
}));
describe('PostStatus Component', () => {
  const mockAuthTokenInstance = mock<AuthToken>();
  const mockUserInstance = mock<User>();

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it('When first rendered the Post Status and Clear buttons are both disabled', () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it('Both buttons are enabled when the text field has text', async () => {
    const { postStatusButton, clearStatusButton, statusTextArea, user } =
      renderPostStatusAndGetElements();

    await user.type(statusTextArea, 'a');

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it('Both buttons are disabled when the text field is cleared.', async () => {
    const { postStatusButton, clearStatusButton, statusTextArea, user } =
      renderPostStatusAndGetElements();

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();

    await user.type(statusTextArea, 'a');

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.clear(statusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();

    await user.type(statusTextArea, 'b');
    await user.click(clearStatusButton);

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls the presenter's `submitPost` method when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const expectedContent = 'This is my status update!';
    const { postStatusButton, statusTextArea, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(statusTextArea, expectedContent);

    await user.click(postStatusButton);

    const [capturedEvent] = capture(mockPresenter.submitPost).last();
    verify(
      mockPresenter.submitPost(capturedEvent, expectedContent, mockUserInstance)
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);
  const postStatusButton = screen.getByRole('button', { name: /Post Status/i });
  const clearStatusButton = screen.getByRole('button', { name: /Clear/i });
  const statusTextArea = screen.getByLabelText('submission');

  return { postStatusButton, clearStatusButton, statusTextArea, user };
};
