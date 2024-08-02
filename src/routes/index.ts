import Method from '@/enum/method';
import Status from '@/enum/status';

import {
  OpenApiBuilder,
  OpenApiMethod,
  OpenApiResponse
} from '@/util/openapi_builder';

import { IndexRespone, Version } from '@/interfaces';
import { Request, Response } from '@/util/handler';

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
            .description('Ok')
            .name('Index')
            .schema({
              type: 'object',
              properties: {
                latest: { type: 'integer' },
                swagger: { type: 'string' },
                versions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      version: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          code: { type: 'integer' }
                        }
                      },
                      path: { type: 'string' },
                      changelog: { type: 'string' },
                      deprecated: { type: 'boolean' }
                    }
                  }
                }
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

export default function handler(req: Request, res: Response<IndexRespone>) {
  if (req.method !== Method.GET)
    return res.error(
      Status.METHOD_NOT_ALLOWED,
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

  return res.status(Status.OK).json({
    latest: versions.length - 1,
    swagger: '/swagger.json',
    versions
  });
}
