import Method from '../../enum/method';
import Status from '../../enum/status';

import { Request, Response } from '../../util/handler';

export default function handler(req: Request, res: Response<string>) {
  if (req.method !== Method.GET)
    return res.error(
      Status.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  return res.status(Status.OK).send('tba');
}
