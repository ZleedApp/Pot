import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import Logger from './util/logger';
import pathParser from './util/path_parser';
import version from './util/version';

import { Request, Response } from './util/handler';

import fs from 'fs';
import path from 'path';
import getRoutes from './util/get_routes';

const app = express();

const logger = new Logger('pot');
const webLogger = new Logger('pot::middleware::logger');

const PORT = parseInt(process.env.PORT!) || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'data', 'static')));

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', `Pot/${version}`);

  next();

  webLogger.info(
    `${req.ip} "${req.method} ${req.path} HTTP/${req.httpVersion}" ${res.statusCode} ${res.get('Content-Length') ? res.get('Content-Length') : '0'} "${req.get('Referer') ? req.get('Referer') : '-'}" "${req.get('User-Agent')}"`
  );
});

(async () => {
  const startTimestamp = Date.now();

  await mongoose.connect(process.env.MONGO_URI!);

  const routes: string[] = await getRoutes(path.join(__dirname, 'routes'));

  for (const route of routes) {
    const routePath = pathParser(
      route.replace(__dirname, '').replace(/\\/g, '/')
    );
    const routeHandler = await import(route);

    logger.info('+', `\`${routePath}\``);

    app.all(routePath, (req, res) => {
      try {
        routeHandler.default(new Request(req), new Response(res));
      } catch (err: any) {
        logger.error(err.message);

        res.status(500).json({
          error: 500,
          message: 'error.generic.internalServerError'
        });
      }
    });
  }

  app.use((req, res) => {
    res.status(404).json({
      error: 404,
      message: 'error.generic.notFound'
    });
  });

  app.listen(PORT, () => {
    logger.info('Using port', PORT);
    logger.info('Took', Date.now() - startTimestamp, 'ms to start');
  });
})().catch((err) => {
  logger.error(err.message);
});

// make bigint json serializable
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
