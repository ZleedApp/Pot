import Method from '../enum/method';
import Status from '../enum/status';

import { Request, Response } from '../util/handler';

import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response<any>) {
  if (req.method !== Method.GET)
    return res.error(
      Status.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  const swaggerData = fs.readFileSync(
    path.join(__dirname, '..', '..', 'data', 'swagger.json'),
    'utf8'
  );

  return res.status(Status.OK).json(JSON.parse(swaggerData));
}
