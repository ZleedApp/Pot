// just so I don't have to use any or unkown. `Response<Langauge>` looks way better :3
export interface Langauge {
  [key: string]: { [key: string]: { [key: string]: string } | string } | string;
}
