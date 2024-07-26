import express from 'express';
import cors from 'cors';

import Logger from './util/logger';
import pathParser from './util/path_parser';
import { Request, Response } from './util/handler';

import fs from 'fs';
import path from 'path';

const app = express();
const logger = new Logger();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use((req, res, next) => {
  next();

  logger.info(
    `${req.ip} "${req.method} ${req.path} HTTP/${req.httpVersion}" ${res.statusCode} ${res.get('Content-Length') ? res.get('Content-Length') : '0'} "${req.get('Referer') ? req.get('Referer') : '-'}" "${req.get('User-Agent')}"`
  );
});

const routes: string[] = [];

const exploreRoutes = (dir: string) => {
  const iRoutes = fs.readdirSync(dir);

  for (const route of iRoutes) {
    if (fs.lstatSync(path.join(dir, route)).isDirectory())
      exploreRoutes(path.join(dir, route));
    else {
      if (route.endsWith('.ts')) {
        routes.push(path.join(dir, route));
      }
    }
  }
};

(async () => {
  exploreRoutes(path.join(__dirname, 'routes'));

  for (const route of routes) {
    const routePath = pathParser(
      route.replace(__dirname, '').replace(/\\/g, '/')
    );
    const routeHandler = await import(route);

    logger.info('+', `\`${routePath}\``);

    app.all(routePath, (req, res) => {
      routeHandler.default(new Request(req), new Response(res));
    });
  }

  app.use((req, res) => {
    res.status(404).json({
      error: 404,
      message: 'Route Not Found'
    });
  });
})();

app.listen(PORT, () => {
  logger.info('Starting server on port:', PORT);
});
