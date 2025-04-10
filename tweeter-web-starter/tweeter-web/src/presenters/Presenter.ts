export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (
    message: string,
    timeout: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
}

export abstract class Presenter<V extends View, U> {
  private _view: V;
  private _service: U;

  public constructor(view: V) {
    this._view = view;
    this._service = this.createService();
  }

  protected abstract createService(): U;

  public get service() {
    return this._service;
  }

  public get view(): V {
    return this._view;
  }

  public async doFailureReportingOperation<T>(
    operation: () => Promise<T>,
    operationDescription: string,
    finalOperation: () => void
  ) {
    try {
      return await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      finalOperation();
    }
  }
}
