import pathParser from '../util/path_parser';
import getRoutes from '../util/get_routes';

import fs from 'fs';
import path from 'path';

import type { OpenApi, OpenApiSchema } from '../util/openapi_builder';

const swaggerPath = path.join(__dirname, '..', '..', 'data', 'swagger.json');
const currentSpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

(async () => {
  const routes: string[] = await getRoutes(
    path.join(__dirname, '..', 'routes')
  );

  for (const route of routes) {
    const routePath = pathParser(
      route.replace(path.join(__dirname, '..'), '').replace(/\\/g, '/')
    );

    const r = await import(route);

    if (r.openapi) {
      const api: OpenApi = r.openapi();

      currentSpec.paths[routePath] = api.paths;

      Object.entries(api.schemas).forEach(
        ([key, value]: [string, OpenApiSchema]) => {
          currentSpec.components.schemas[key] = value;
        }
      );
    }
  }

  fs.writeFileSync(swaggerPath, JSON.stringify(currentSpec, null, 2));

  console.log('Sucessfully generated `swagger.json`!');
})();
