import Method from '../../../enum/method';
import Status from '../../../enum/status';

import { Request, Response } from '../../../util/handler';
import { User } from '../../../interfaces/user';

import { verify } from 'jsonwebtoken';

import {
  OpenApiBuilder,
  OpenApiMethod,
  OpenApiResponse
} from '../../../util/openapi_builder';

import Database from '../../../util/database';

import type { OpenApi } from '../../../util/openapi_builder';

interface ZleedJWT {
  id: bigint;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export const openapi = (): OpenApi => {
  return new OpenApiBuilder()
    .addMethod(
      Method.GET,
      new OpenApiMethod().description('User info.').addResponse(
        Status.OK,
        new OpenApiResponse<User>()
          .description('Ok')
          .name('User')
          .schema({
            type: 'object',
            properties: {
              id: { type: 'integer' },
              username: { type: 'string' },
              displayName: { type: 'string' },
              email: { type: 'string' },
              avatar: { type: 'string' },
              banner: { type: 'string' },
              badges: { type: 'array', items: { type: 'integer' } },
              connections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    url: { type: 'string' },
                    createdAt: { type: 'integer' }
                  }
                }
              },
              streamTitle: { type: 'string' },
              streamKeys: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    key: { type: 'string' },
                    createdAt: { type: 'integer' }
                  }
                }
              },
              lastLive: { type: 'string' },
              createdAt: { type: 'integer' },
              updatedAt: { type: 'integer' }
            }
          })
      )
    )
    .build();
};

export default function handler(req: Request, res: Response<User>) {
  const jwtToken = req.getHeader('Authorization');

  if (!jwtToken) {
    return res.error(Status.UNAUTHORIZED, 'error.auth.noToken');
  }

  const tokenSplit = jwtToken.split(' ');

  if (
    !(tokenSplit.length > 1) ||
    jwtToken.split(' ')[0].toLowerCase() !== 'bearer'
  ) {
    return res.error(Status.UNAUTHORIZED, 'error.auth.invalidToken');
  }

  const token = tokenSplit[1];

  verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
    if (err) {
      return res.error(Status.UNAUTHORIZED, 'error.auth.invalidToken');
    }

    const data = decoded as ZleedJWT;

    data.id = BigInt(data.id);

    if (req.method === Method.GET) {
      const user = await Database.getUser(data.id);

      res.status(Status.OK).json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        banner: user.banner,
        badges: user.badges,
        connections: user.connections,
        streamTitle: user.streamTitle,
        streamKeys: user.streamKeys,
        lastLive: user.lastLive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    }
  });
}
