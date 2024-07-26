import Method from '../enum/method';

import { IndexRespone, ErrorRespone, Version } from '../interfaces';
import { Request, Response } from '../util/handler';

export default function handler(
  req: Request,
  res: Response<IndexRespone | ErrorRespone>
) {
  if (req.method !== Method.GET)
    return res.status(405).json({
      error: 405,
      message: 'Method Not Allowed'
    });

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
