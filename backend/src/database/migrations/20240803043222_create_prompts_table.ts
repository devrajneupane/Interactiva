import { Knex } from "knex";

import { TABLE } from "../../enums";

/**
 * Create table `TABLE.PROMPT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.PROMPT, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table.string("title", 255).notNullable();
    table.text("prompt").notNullable();
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
 * Drop table `TABLE.PROMPT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE.PROMPT);
}
