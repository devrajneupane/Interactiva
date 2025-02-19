import { Knex } from "knex";

import { TABLE } from "../../enums/Tables";

/**
 * Create table `TABLE.MODEL`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.MODEL, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table.string("name", 50).notNullable();
    table.text("description");
    table.jsonb("params");
    table.integer("likes").defaultTo(0);
    table
      .uuid("user_id", { useBinaryUuid: true })
      .references("id")
      .inTable(TABLE.USER)
      .onDelete("CASCADE");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();
  });
}

/**
 * Drop table `TABLE.MODEL`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE.MODEL);
}
