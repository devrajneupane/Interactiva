import { Knex } from "knex";

import { TABLE } from "../../enums";

/**
 * Create table `TABLE.COMMENT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE.COMMENT, (table) => {
    table.uuid("id", { primaryKey: true, useBinaryUuid: true });
    table.uuid("commentable_id", { useBinaryUuid: true }).notNullable();
    table
      .enu("commentable_type", [TABLE.PROMPT, TABLE.MODEL], {
        useNative: true,
        enumName: "commentable_type",
      })
      .notNullable();
    table.string("comment", 500).notNullable();
    table
      .uuid("user_id", { useBinaryUuid: true })
      .references("id")
      .inTable(TABLE.USER)
      .onDelete("CASCADE");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();

    // Add polymorphic index
    table.index(
      ["commentable_type", "commentable_id"],
      "idx_comments_polymorphic",
    );
  });
}

/**
 * Drop table `TABLE.COMMENT`.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE.COMMENT);
  await knex.schema.raw(`DROP TYPE IF EXISTS commentable_type;`);
  await knex.schema.table(TABLE.COMMENT, function (table) {
    table.dropIndex(
      ["commentable_type", "commentable_id"],
      "idx_comments_polymorphic",
    );
  });
}
