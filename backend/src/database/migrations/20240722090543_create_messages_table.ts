import { Knex } from "knex";

import { SENDER, TABLE } from "../../enums";

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
      .notNullable()
      .onDelete("CASCADE");
    table
      .enu("sender", Object.values(SENDER), {
        useNative: true,
        enumName: "sender",
      })
      .notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();
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
