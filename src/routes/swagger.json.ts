import Method from '../enum/method';
import Error from '../enum/error';

import { Request, Response } from '../util/handler';

import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response<any>) {
  if (req.method !== Method.GET)
    return res.error(
      Error.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  const swaggerData = fs.readFileSync(
    path.join(__dirname, '..', '..', 'data', 'swagger.json'),
    'utf8'
  );

  return res.status(200).json(JSON.parse(swaggerData));
}
