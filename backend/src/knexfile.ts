import { Knex } from "knex";

import { env } from "./config";

export const baseKnexConfig: Knex.Config = {
  client: env.database.client,
  connection: {
    host: env.database.host,
    port: +env.database.port!,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
  },
};

const knexConfig: Knex.Config = {
  ...baseKnexConfig,
  migrations: {
    directory: "./database/migrations/",
    tableName: "migrations",
    extension: "ts",
    stub: "./stubs/migration.stub",
  },

  // loads data into table
  seeds: {
    directory: "./database/seeds/",
    extension: "ts",
    stub: "./stubs/seed.stub",
  },
};

export default knexConfig;
