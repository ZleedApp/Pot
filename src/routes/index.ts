import Method from '../enum/method';
import Error from '../enum/error';

import { IndexRespone, Version } from '../interfaces';
import { Request, Response } from '../util/handler';

export default function handler(req: Request, res: Response<IndexRespone>) {
  if (req.method !== Method.GET)
    return res.error(
      Error.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  const versions: Version[] = [
    {
      version: {
        name: 'v0.0.1-dev',
        code: 1
      },
      path: '/v1',
      changelog: '/v1/changelog.txt',
      deprecated: false
    }
  ];

  return res.status(200).json({
    latest: versions.length - 1,
    swagger: '/swagger.json',
    versions
  });
}
