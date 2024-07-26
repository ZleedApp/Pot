export interface IndexRespone {
  latest: number;
  swagger: string;
  versions: Version[];
}

export interface Version {
  version: {
    name: string;
    code: number;
  };
  path: string;
  changelog: string;
  deprecated: boolean;
}
