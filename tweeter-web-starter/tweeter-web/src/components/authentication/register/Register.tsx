import './Register.css';
import 'bootstrap/dist/css/bootstrap.css';
import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationFormLayout from '../AuthenticationFormLayout';
import AuthenticationFields from '../AuthenticationFields';
import {
  RegisterPresenter,
  RegisterView,
} from '../../../presenters/authentication/RegisterPresenter';
import useToastListener from '../../toaster/ToastListenerHook';
import useUserInfo from '../../userInfo/UserInfoHook';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const view: RegisterView = {
    setImageUrl,
    setIsLoading,
    updateUserInfo,
    displayErrorMessage,
    getFirstName: () => firstName,
    getLastName: () => lastName,
    getAlias: () => alias,
    getPassword: () => password,
    getImageUrl: () => imageUrl,
    getRememberMe: () => rememberMe,
  };

  const presenter = new RegisterPresenter(view);

  const handleRegister = async () => {
    const success = await presenter.doAccess();
    if (success) navigate('/');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) presenter.processImageFile(file);
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={() => (
        <>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="firstNameInput"
              placeholder="First Name"
              onChange={(event) => setFirstName(event.target.value)}
            />
            <label htmlFor="firstNameInput">First Name</label>
          </div>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="lastNameInput"
              placeholder="Last Name"
              onChange={(event) => setLastName(event.target.value)}
            />
            <label htmlFor="lastNameInput">Last Name</label>
          </div>
          <AuthenticationFields
            setAlias={setAlias}
            setPassword={setPassword}
            onEnter={(event) => presenter.onEnter(event, handleRegister)}
          />
          <div className="form-floating mb-3">
            <input
              type="file"
              className="form-control"
              id="imageFileInput"
              onChange={handleFileChange}
            />
            <label htmlFor="imageFileInput">User Image</label>
            {imageUrl && (
              <img src={imageUrl} className="img-thumbnail" alt="User" />
            )}
          </div>
        </>
      )}
      switchAuthenticationMethodGenerator={() => (
        <div className="mb-3">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      )}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => {
        return presenter.checkSubmitButtonStatus();
      }}
      isLoading={isLoading}
      submit={handleRegister}
    />
  );
};

export default Register;
