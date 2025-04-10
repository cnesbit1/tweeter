import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../../../../src/components/authentication/login/Login';
import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  LoginPresenter
} from '../../../../src/presenters/authentication/LoginPresenter';
import {
  mock,
  instance,
  verify,
} from '@typestrong/ts-mockito';

library.add(fab);

describe('Login Component', () => {
  it('when first rendered the sign-in button is disabled', () => {
    const { signInButton } = renderLoginAndGetElements('/');
    expect(signInButton).toBeDisabled();
  });

  it('the sign-in button is enabled when both the alias and password fields have text', async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements('/');

    await user.type(aliasField, 'a');
    await user.type(passwordField, 'b');

    expect(signInButton).toBeEnabled();
  });

  it('the sign-in button is disabled if either the alias or password field is cleared', async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements('/');

    await user.type(aliasField, 'a');
    await user.type(passwordField, 'b');

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, '1');
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();

    await user.type(passwordField, '2');
    expect(signInButton).toBeEnabled();
  });

  it("The presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const alias = '@somealias';
    const password = 'somepassword';

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements('/', mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doAccess()).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);
  const signInButton = screen.getByRole('button', { name: /Sign in/i });
  const aliasField = screen.getByLabelText('alias');
  const passwordField = screen.getByLabelText('password');

  return { signInButton, aliasField, passwordField, user };
};
