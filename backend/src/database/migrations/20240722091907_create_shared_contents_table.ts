import { Knex } from "knex";

import { TABLE } from "../../enums/Tables";

/**
 * Create table `TABLE.SHARED_CONTENT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.SHARED_CONTENT, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table.uuid("shared_by", { useBinaryUuid: true });
    table.timestamp("shared_at").notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * Drop table `TABLE.SHARED_CONTENT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE.SHARED_CONTENT);
}

