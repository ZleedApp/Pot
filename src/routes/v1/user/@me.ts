import Method from '../../../enum/method';
import Status from '../../../enum/status';

import { Request, Response } from '../../../util/handler';
import { User } from '../../../interfaces/user';

import { verify } from 'jsonwebtoken';

import Database from '../../../util/database';

interface ZleedJWT {
  id: bigint;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

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
