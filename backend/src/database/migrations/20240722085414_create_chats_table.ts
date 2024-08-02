import { Knex } from "knex";

import { TABLE } from "../../enums/Tables";

/**
 * Create table `TABLE.CHAT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.CHAT, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table
      .uuid("user_id", { useBinaryUuid: true })
      .references("id")
      .inTable(TABLE.USER)
      .onDelete("CASCADE");
    table.string("title", 100).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());
  });
}

/**
 * Drop table `TABLE.CHAT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE.CHAT);
}
