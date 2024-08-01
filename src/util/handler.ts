import Status from '../enum/status';
import Method from '../enum/method';

export class Request {
  public method: Method;
  public headers: { [key: string]: string };
  public body: { [key: string]: any };
  public params: { [key: string]: string | number };

  /**
   * Implement a method instead of using this!
   * This is only public for testing purposes.
   */
  public req: any;

  constructor(req: any) {
    this.method = req.method;
    this.headers = req.headers;

    this.body = req.body;
    this.params = req.params;
  }

  getHeader(key: string): string {
    return this.headers[key.toLowerCase()];
  }

  getParam(key: string) {
    return this.params[key.toLowerCase()];
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

  public status(code: Status) {
    return {
      json: (data?: T) => {
        this.res.status(code).json(data);
      },
      send: (data?: T) => {
        this.res.type('txt').status(code).send(data);
      }
    };
  }

  public error(code: Status, message: string) {
    return this.res.status(code).json({
      error: code,
      message
    });
  }
}
