import { Knex } from "knex";

import { TABLE } from "../../enums/Tables";

/**
 * Create table `TABLE.MESSAGE`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.MESSAGE, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table
      .uuid("chat_id", { useBinaryUuid: true })
      .references("id")
      .inTable(TABLE.CHAT)
      .onDelete("CASCADE");
    table.string("title", 100).nullable();
    table
      .enu("sender", ["user", "model"], {
        useNative: true,
        enumName: "sender",
      })
      .notNullable();
    table.string("message").notNullable();
    table.timestamp("send_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now());
  });
}

/**
 * Drop table  `TABLE.MESSAGE`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE.MESSAGE);
  await knex.schema.raw(`DROP TYPE IF EXISTS sender;`);
}
