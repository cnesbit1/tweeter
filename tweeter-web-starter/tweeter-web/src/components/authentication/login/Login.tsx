import './Login.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationFormLayout from '../AuthenticationFormLayout';
import AuthenticationFields from '../AuthenticationFields';
import {
  LoginPresenter,
  LoginView,
} from '../../../presenters/authentication/LoginPresenter';
import useToastListener from '../../toaster/ToastListenerHook';
import useUserInfo from '../../userInfo/UserInfoHook';

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const view: LoginView = {
    setAlias,
    setPassword,
    setIsLoading,
    updateUserInfo,
    displayErrorMessage,
    getAlias: () => alias,
    getPassword: () => password,
    getRememberMe: () => rememberMe,
  };

  const presenter = props.presenter ?? new LoginPresenter(view);

  const handleLogin = async () => {
    const success = await presenter.doAccess();
    if (success) {
      if (props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate('/');
      }
    }
  };

  const inputFieldGenerator = () => (
    <AuthenticationFields
      setAlias={setAlias}
      setPassword={setPassword}
      onEnter={(event) => presenter.onEnter(event, handleLogin)}
    />
  );

  const switchAuthenticationMethodGenerator = () => (
    <div className="mb-3">
      Not registered? <Link to="/register">Register</Link>
    </div>
  );

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => presenter.checkSubmitButtonStatus()}
      isLoading={isLoading}
      submit={handleLogin}
    />
  );
};

export default Login;
