import { MessageView, Presenter } from '../Presenter';

export interface UserInteractionView extends MessageView {
  getCurrentUser: () => any;
  setIsLoading: (isLoading: boolean) => void;
}

export abstract class UserInteractionPresenter<
  V extends UserInteractionView,
  S
> extends Presenter<V, S> {
  protected async executeWithFeedback(
    actionDescription: string,
    time: number,
    operation: () => Promise<any>,
    errorDescription: string,
    event?: React.MouseEvent
  ) {
    if (event) event.preventDefault();

    this.view.setIsLoading(true);
    this.view.displayInfoMessage(`${actionDescription}...`, time);

    await this.doFailureReportingOperation(
      async () => {
        await operation();
      },
      errorDescription,
      () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }
}
