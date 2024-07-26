import Method from '../../enum/method';

import { ErrorRespone } from '../../interfaces';
import { Request, Response } from '../../util/handler';

export default function handler(
  req: Request,
  res: Response<string | ErrorRespone>
) {
  if (req.method !== Method.GET)
    return res.status(405).json({
      error: 405,
      message: 'Method Not Allowed'
    });

  return res.status(200).send('tba');
}
