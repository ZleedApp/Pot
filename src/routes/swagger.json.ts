import Method from '../enum/method';

import { ErrorRespone } from '../interfaces';
import { Request, Response } from '../util/handler';

import fs from 'fs';
import path from 'path';

export default function handler(
  req: Request,
  res: Response<unknown | ErrorRespone>
) {
  if (req.method !== Method.GET)
    return res.status(405).json({
      error: 405,
      message: 'Method Not Allowed'
    });

  const swaggerData = fs.readFileSync(
    path.join(__dirname, '..', '..', 'data', 'swagger.json'),
    'utf8'
  );

  return res.status(200).json(JSON.parse(swaggerData));
}
