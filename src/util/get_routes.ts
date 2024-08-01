import fs from 'fs';
import path from 'path';

export default async function getRoutes(rDir: string): Promise<string[]> {
  const routes: string[] = [];

  const exploreRoutes = async (dir: string) => {
    const iRoutes = fs.readdirSync(dir);

    for (const route of iRoutes) {
      if (fs.lstatSync(path.join(dir, route)).isDirectory())
        await exploreRoutes(path.join(dir, route));
      else {
        if (route.endsWith('.ts')) {
          routes.push(path.join(dir, route));
        }
      }
    }
  };

  await exploreRoutes(rDir);

  return routes;
}
