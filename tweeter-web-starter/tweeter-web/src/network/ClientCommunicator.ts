import { TweeterResponse } from 'tweeter-shared';

export class ClientCommunicator {
  private SERVER_URL =
    'https://ztqbhkfjr0.execute-api.us-east-1.amazonaws.com/dev';

  public async doPost<REQ, RES extends TweeterResponse>(
    req: REQ,
    endpoint: string,
    headers?: Headers
  ): Promise<RES> {
    if (!headers) {
      headers = new Headers();
    }
    headers.set('Content-Type', 'application/json');

    const url = this.SERVER_URL + endpoint;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req),
    });

    console.log('Register response:', response);

    const json = await response.json();

    if (!response.ok || json.success === false) {
      throw new Error(json.message ?? 'Unknown error');
    }

    console.log(json.success === true);

    return json as RES;
  }
}
