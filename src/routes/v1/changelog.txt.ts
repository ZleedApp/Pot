import Method from '../../enum/method';
import Error from '../../enum/error';

import { Request, Response } from '../../util/handler';

export default function handler(req: Request, res: Response<string>) {
  if (req.method !== Method.GET)
    return res.error(
      Error.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  return res.status(200).send('tba');
}
