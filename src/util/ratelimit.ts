import sqlite3 from 'sqlite3';

import Status from '@/enum/status';

import type { Request, Response, NextFunction } from 'express';

const sql = sqlite3.verbose();
const db = new sql.Database(':memory:'); // TODO: change to a file

db.serialize(() => {
  db.run('CREATE TABLE ratelimit (ip VARCHAR(39), requests INT, reset DATE)');
});

interface RateLimitRow {
  ip: string;
  requests: number;
  reset: number;
}

const LIMIT = 300;
const RESET = 60 * 1000;

export default function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader('X-Ratelimit-Limit', LIMIT);

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  db.get(
    'SELECT * FROM ratelimit WHERE ip = ?',
    [ip],
    (err, row: RateLimitRow) => {
      if (err) {
        return res.status(Status.INTERNAL_SERVER_ERROR).json({
          error: Status.INTERNAL_SERVER_ERROR,
          message: 'error.generic.internalServerError'
        });
      }

      if (!row) {
        db.run('INSERT INTO ratelimit VALUES (?, ?, ?)', [
          ip,
          1,
          new Date(Date.now() + RESET)
        ]);

        res.setHeader('X-Ratelimit-Remaining', LIMIT - 1);
        res.setHeader('X-Ratelimit-Reset', '60');

        return next();
      }

      if (new Date(row.reset) <= new Date()) {
        const newTime = new Date(Date.now() + RESET);

        db.run('UPDATE ratelimit SET requests = 1, reset = ? WHERE ip = ?', [
          newTime,
          ip
        ]);

        res.setHeader('X-Ratelimit-Remaining', LIMIT - 1);
        res.setHeader(
          'X-Ratelimit-Reset',
          Math.floor((newTime.getTime() - Date.now()) / 1000)
        );

        return next();
      }

      if (row.requests > LIMIT) {
        res.setHeader('X-Ratelimit-Remaining', '0');
        res.setHeader(
          'X-Ratelimit-Reset',
          Math.floor((new Date(row.reset).getTime() - Date.now()) / 1000)
        );

        return res.status(Status.TOO_MANY_REQUESTS).json({
          error: Status.TOO_MANY_REQUESTS,
          message: 'error.generic.tooManyRequests'
        });
      }

      res.setHeader('X-Ratelimit-Remaining', LIMIT - row.requests);
      res.setHeader(
        'X-Ratelimit-Reset',
        Math.floor((new Date(row.reset).getTime() - Date.now()) / 1000)
      );

      db.run('UPDATE ratelimit SET requests = requests + 1 WHERE ip = ?', [ip]);

      next();
    }
  );
}
