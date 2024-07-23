import { UUID } from "crypto";

import { BaseModel } from "./Base";
import { TABLE } from "../enums/Tables";
import { IGetUserQuery, IUser } from "../interface/User";

/**
 * UserModel class represents operations related to user management
 * Extends BaseModel for common functionalities
 */
export class UserModel extends BaseModel {
  /**
   * Retrieves a list of users based on filter criteria
   *
   * @param filter Filter criteria including search query, page, and size
   * @returns users
   */
  static async getUsers(filter: IGetUserQuery) {
    const { q } = filter;

    const users = this.connection<IUser>(TABLE.USER)
      .select(
        "id",
        "name",
        "email",
        "role",
        "created_at",
        "updated_at",
        "updated_by",
      )
      .limit(filter.size || 10)
      .offset((filter.page || 1 - 1) * (filter.size || 10));

    if (q) {
      users.whereLike("name", `%${q}%`);
    }

    return users;
  }

  /**
   * Creates a new user
   *
   * @param user User data excluding ID
   * @returns Newly created user object excluding password
   * @throws Error if user with the same email already exists
   */
  static async createUser(user: IUser) {
    await this.queryBuilder().transaction(async (trx) => {
      await trx(TABLE.USER).insert(user);
    });
  }

  /**
   * Updates an existing user
   *
   * @param id User ID
   * @param userData Partial user data to update
   */
  static async updateUser(id: UUID, userData: Partial<IUser>) {
    await this.queryBuilder().transaction(async (trx) => {
      await trx(TABLE.USER).where({ id }).update(userData);
    });
  }

  /**
   * Deletes a user by ID
   *
   * @param id User ID
   */
  static async deleteUser(id: UUID) {
    // await this.queryBuilder().del().table(TABLE.USER).where({ id });
    await this.queryBuilder().transaction(async (trx) => {
      await trx(TABLE.USER).where({ id }).del();
    });
  }

  /**
   * Retrieves user by email
   *
   * @param email User email
   * @returns User object if found
   * @throws Error if user with provided email does not exist
   */
  static async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.connection<IUser>(TABLE.USER)
      .where({ email })
      .first();
    return user!;
  }

  /**
   * Retrieves user by id
   *
   * @param id User id
   * @returns User object if found
   * @throws Error if user with provided email does not exist
   */
  static async getUserById(id: UUID): Promise<IUser> {
    const user = await this.connection<IUser>(TABLE.USER).where({ id }).first();
    return user!;
  }
}
