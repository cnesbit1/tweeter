
import { ServerFacade } from '../../network/ServerFacade';

export abstract class Service {
  protected serverFacade = new ServerFacade();
}
