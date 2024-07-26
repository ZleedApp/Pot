import Error from '../../../enum/error';
import Method from '../../../enum/method';

import snowflake from '../../../util/snowflake';

import Logger from '../../../util/logger';

import { Request, Response } from '../../../util/handler';
import { UserRespose } from '../../../interfaces/user';
import { isValidEmail } from '../../../util/validators';
import { User } from '../../../models';

import { sign } from 'jsonwebtoken';

import bcrypt from 'bcrypt';

const saltRounds = 10;

const logger = new Logger('pot::web::auth/register');

export default async function handler(
  req: Request,
  res: Response<UserRespose>
) {
  if (req.method !== Method.POST)
    return res.error(
      Error.METHOD_NOT_ALLOWED,
      'error.generic.methodNotAllowed'
    );

  const { email, password } = req.body;

  if (!email)
    return res.error(Error.BAD_REQUEST, 'error.generic.fieldMissing;("email")');
  if (!password)
    return res.error(
      Error.BAD_REQUEST,
      'error.generic.fieldMissing;("password")'
    );

  if (!isValidEmail(email))
    return res.error(Error.BAD_REQUEST, 'error.auth.invalidEmail');

  try {
    const user = await User.findOne({ email });

    if (!user) return res.error(Error.NOT_FOUND, 'error.auth.userNotFound');

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.error(Error.UNAUTHORIZED, 'error.auth.invalidPassword');

    const token = sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      jwt: token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        banner: user.banner,
        badges: user.badges.map((badge) => badge.valueOf() as bigint),
        streamTitle: user.streamTitle,
        streamKeys: user.streamKeys.map((streamKey) => ({
          id: streamKey.id!,
          key: streamKey.key!,
          created_at: streamKey.created_at
        })),
        connections: user.connections.map((connection) => ({
          id: connection.id!,
          url: connection.url!,
          created_at: connection.created_at
        })),
        lastLive: user.lastLive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (e: any) {
    return res.error(
      Error.INTERNAL_SERVER_ERROR,
      'error.generic.internalServerError'
    );
  }
}
