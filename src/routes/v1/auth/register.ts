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

  const { username, email, password } = req.body;

  if (!username)
    return res.error(
      Error.BAD_REQUEST,
      'error.generic.fieldMissing;("username")'
    );
  if (!email)
    return res.error(Error.BAD_REQUEST, 'error.generic.fieldMissing;("email")');
  if (!password)
    return res.error(
      Error.BAD_REQUEST,
      'error.generic.fieldMissing;("password")'
    );

  if (username.length < 3)
    return res.error(
      Error.BAD_REQUEST,
      'error.generic.fieldTooShort;("username", 3)'
    );

  const safeUsername = username
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(' ', '_');

  if (safeUsername.length < 3)
    return res.error(Error.BAD_REQUEST, 'error.auth.usernameTooShort');
  if (safeUsername.length > 32)
    return res.error(Error.BAD_REQUEST, 'error.auth.usernameTooLong');

  if (!isValidEmail(email))
    return res.error(Error.BAD_REQUEST, 'error.auth.invalidEmail');

  const saltedPassword = await bcrypt.hash(password, saltRounds);
  const uid = snowflake.getUniqueID();

  const userDocument = new User({
    id: uid,
    username: safeUsername,
    displayName: username.trim(),
    email,
    password: saltedPassword
  });

  try {
    await userDocument.save();

    const token = sign(
      {
        id: uid,
        email: email,
        username: safeUsername
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      jwt: token,
      user: {
        id: uid,
        username: safeUsername,
        displayName: username.trim(),
        email,
        avatar: 'default.png',
        banner: 'default.png',
        badges: [],
        streamTitle: 'Untitled Stream',
        streamKeys: [],
        connections: [],
        lastLive: null,
        createdAt: userDocument.createdAt,
        updatedAt: userDocument.updatedAt
      }
    });
  } catch (e: any) {
    logger.error(e);

    if (e.code === 11000) {
      if (e.keyPattern.email === 1) {
        return res.error(Error.BAD_REQUEST, 'error.auth.emailAlreadyInUse');
      }

      if (e.keyPattern.username === 1) {
        return res.error(Error.BAD_REQUEST, 'error.auth.usernameAlreadyInUse');
      }
    }

    return res.error(
      Error.INTERNAL_SERVER_ERROR,
      'error.generic.internalServerError'
    );
  }
}
