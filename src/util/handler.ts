import Method from '../enum/method';

export class Request {
  public method: Method;
  public headers: object;

  /**
   * Implement a method instead of using this!
   * This is only public for testing purposes.
   */
  public req: any;

  constructor(req: any) {
    this.method = req.method;
    this.headers = req.headers;
  }
}

export class Response<T> {
  /**
   * Implement a method instead of using this!
   * This is only public for testing purposes.
   */
  public res: any;

  constructor(res: any) {
    this.res = res;
  }

  public status(code: number) {
    return {
      json: (data: T) => {
        this.res.status(code).json(data);
      },
      send: (data: T) => {
        this.res.status(code).send(data);
      }
    };
  }
}
