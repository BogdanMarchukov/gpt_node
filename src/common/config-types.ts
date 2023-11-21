export enum RootKeys {
  Database = 'database',
  Gpt = 'gpt',
}

export interface Database {
  dialect: string;
  host: string;
  username: string;
  database: string;
  password: string;
  port: number;
}

export interface Gpt {
  key: string;
  model: string;
}

export interface Config {
  [RootKeys.Database]: Database;
  [RootKeys.Gpt]: Gpt;
}
