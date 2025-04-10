import { Buffer } from 'buffer';
import {
  AuthenticationPresenter,
  AuthenticationView,
} from './AuthenticationPresenter';
import { User, AuthToken } from '../../../../tweeter-shared';

export interface RegisterView extends AuthenticationView {
  setImageUrl: (imageUrl: string) => void;
  getImageUrl: () => string;
  getFirstName: () => string;
  getLastName: () => string;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  // private imageBytes: Uint8Array = new Uint8Array();
  private imageBytes: string = '';
  private imageFileExtension: string = '';

  public checkSubmitButtonStatus(): boolean {
    const isDisabled =
      !this.view.getFirstName() ||
      !this.view.getLastName() ||
      !this.view.getAlias() ||
      !this.view.getPassword() ||
      !this.view.getImageUrl();

    console.log('Register Button Disabled?: ', isDisabled);
    return isDisabled;
  }

  public async serviceOperation(): Promise<[User, AuthToken]> {
    return await this.service.register(
      this.view.getFirstName(),
      this.view.getLastName(),
      this.view.getAlias(),
      this.view.getPassword(),
      this.imageBytes,
      this.imageFileExtension
    );
  }

  public getItemDescription(): string {
    return 'register';
  }

  public processImageFile(file: File) {
    this.view.setImageUrl(URL.createObjectURL(file));

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      const bufferContent = base64String.split('base64,')[1];

      this.imageBytes = bufferContent;
    };
    reader.readAsDataURL(file);

    this.imageFileExtension = file.name.split('.').pop() || '';
    console.log('This si my image file extension: ', this.imageFileExtension);
  }

  public setRememberMe(value: boolean) {
    // This method is only needed if you want the presenter to store rememberMe state
  }
}
