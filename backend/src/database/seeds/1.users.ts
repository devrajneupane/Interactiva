import { Knex } from "knex";

import { ROLE } from "../../enums/Role";
import { TABLE } from "../../enums/Tables";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE.USER)
    .del()
    .then(() => {
      return knex(TABLE.USER).insert([
        {
          id: "06f44fc3-3b48-4e2e-abfe-b5abab5d933f",
          name: "dave",
          email: "dave@email.com",
          password:
            "$2b$10$EQbCiDl66wfU2Pz38q9B2eB5RByx.KCwHOdqFiWvEmNgQmrzi/HQy",
          role: ROLE.ADMIN,
        },
        {
          id: "fff956ea-6730-41fd-9a99-eafdd9f14e4a",
          name: "Jane",
          email: "jane@email.com",
          password:
            "$2b$10$jyxVP9McABSYv8hehnLrc.DeNqxMeda9VjsQ1e5Gqm.HmUi1u2/0q",
        },
      ]);
    });
}
