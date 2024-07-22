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
    table.uuid("user_id", { useBinaryUuid: true });
    table.uuid("base_model_id", { useBinaryUuid: true });
    table.string("name", 100).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .uuid("created_by")
      .references("id")
      .inTable("users")
      .nullable()
      .onDelete("CASCADE");
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());
    table
      .uuid("updated_by")
      .references("id")
      .inTable("users")
      .nullable()
      .onDelete("CASCADE");
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
