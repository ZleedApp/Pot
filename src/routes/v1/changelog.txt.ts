import Method from '@/enum/method';
import Status from '@/enum/status';

import {
  OpenApiBuilder,
  OpenApiMethod,
  OpenApiResponse
} from '@/util/openapi_builder';

import { Request, Response } from '@/util/handler';

import fs from 'fs';
import path from 'path';

import type { OpenApi } from '@/util/openapi_builder';

export const openapi = (): OpenApi => {
  return new OpenApiBuilder()
    .addMethod(
      Method.GET,
      new OpenApiMethod()
        .description('Information about the api.')
        .addResponse(
          Status.OK,
          new OpenApiResponse()
            .description('Success')
            .name('Changelog')
            .type('text/plain')
            .schema({ type: 'string' })
        )
        .addResponse(
          Status.NOT_ACCEPTABLE,
          new OpenApiResponse()
            .description('Not Acceptable')
            .name('Error')
            .schema({
              type: 'object',
              properties: {
                error: { type: 'integer' },
                message: { type: 'string' }
              }
            })
        )
        .addResponse(
          Status.METHOD_NOT_ALLOWED,
          new OpenApiResponse()
            .description('Method Not Allowed')
            .name('Error')
            .schema({
              type: 'object',
              properties: {
                error: { type: 'integer' },
                message: { type: 'string' }
              }
            })
        )
    )
    .build();
};

export default function handler(req: Request, res: Response<string>) {
  console.log(req);

  if (req.method !== Method.GET)
    return res.error(
      Status.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  if (req.getHeader('Accept') !== 'text/plain')
    return res.error(Status.NOT_ACCEPTABLE, 'error.generic.notAcceptable');

  const changelogData = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'data', 'v1', 'changelog.txt'),
    'utf8'
  );

  return res.status(Status.OK).send(changelogData);
}
