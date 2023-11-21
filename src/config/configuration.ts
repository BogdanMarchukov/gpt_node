import { Config, RootKeys } from 'src/common/config-types';

export default (): Config => ({
  [RootKeys.Database]: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT),
  },
  [RootKeys.Gpt]: {
    key: process.env.API_KEY_OPEN_AI,
    model: process.env.MODEL,
  },
});
