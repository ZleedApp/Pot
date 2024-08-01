import Method from '../../enum/method';
import Status from '../../enum/status';

import { Request, Response } from '../../util/handler';

import fs from 'fs';
import path from 'path';

export default function handler(req: Request, res: Response<string>) {
  if (req.method !== Method.GET)
    return res.error(
      Status.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  const changelogData = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'data', 'v1', 'changelog.txt'),
    'utf8'
  );

  return res.status(Status.OK).send(changelogData);
}
