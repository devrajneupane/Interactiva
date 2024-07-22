import { Knex } from "knex";

import { ROLE } from "../../enums/Role";
import { TABLE } from "../../enums/Tables";

/**
 * Create tables `TABLE.USER`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.USER, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table.string("name", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("password", 100).notNullable();
    table
      .enu("role", Object.values(ROLE), {
        useNative: true,
        enumName: "role",
      })
      .notNullable()
      .defaultTo(ROLE.USER);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();
    table
      .uuid("updated_by")
      .references("id")
      .inTable(TABLE.USER)
      .nullable()
      .onDelete("CASCADE");
  });
}

/**
 * Drop table `TABLE.USER`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE.USER);
  await knex.schema.raw(`DROP TYPE IF EXISTS role;`);
}
