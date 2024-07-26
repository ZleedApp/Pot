import Error from '../enum/error';
import Method from '../enum/method';

export class Request {
  public method: Method;
  public headers: { [key: string]: any };
  public body: { [key: string]: any };
  public params: { [key: string]: any };

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

  getHeader(key: string) {
    return this.headers[key];
  }

  getParam(key: string) {
    return this.params[key];
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
      json: (data?: T) => {
        this.res.status(code).json(data);
      },
      send: (data?: T) => {
        this.res.status(code).send(data);
      }
    };
  }

  public error(code: Error, message: string) {
    return this.res.status(code).json({
      error: code,
      message
    });
  }
}
