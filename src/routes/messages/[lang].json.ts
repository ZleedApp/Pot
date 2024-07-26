import Method from '../../enum/method';
import Error from '../../enum/error';

import { Request, Response } from '../../util/handler';

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// for the error response codes so front-end devs don't need to get extra translations.
export default function handler(req: Request, res: Response<any>) {
  if (req.method !== Method.GET)
    return res.error(
      Error.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  const allowedLanguages = fs.readdirSync(
    path.join(__dirname, '..', '..', '..', 'data', 'lang')
  );

  const lang = req.getParam('lang');

  if (allowedLanguages.includes(`${lang}.json`)) {
    const fileData = fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'data', 'lang', `${lang}.json`),
      'utf8'
    );

    const sum = crypto.createHash('sha1').update(fileData).digest('hex');

    const swaggerData = JSON.parse(fileData);

    swaggerData['_disclaimer'] =
      'These translations are only for messages returned from the api, only use theese messages for your users when a request fails!';

    res.res.set('ETag', `"${sum}"`);

    req.getHeader('If-None-Match') === `"${sum}"` && res.status(304).send();

    return res.status(200).json(swaggerData);
  } else {
    return res.error(Error.NOT_FOUND, 'error.generic.notFound');
  }
}
