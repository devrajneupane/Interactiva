import { UUID } from "crypto";

import bcrypt from "bcrypt";

import { ROLE } from "../enums/Role";
import * as UserModel from "../model/userModel";
import { ConflictError, NotFound, UnauthorizedError } from "../error";
import { IGetUserQuery, IUpdateUser, IUser } from "../interface/User";
import { getUUID } from "../utils/utils";

/**
 * Get user info
 *
 * @param {UUID} id User ID
 * @returns  User object
 */
export async function getUserInfo(id: UUID) {
  const user = await getUserById(id);

  const { password, ...data } = user;

  return {
    message: "User info retrieved successfully",
    data: data,
  };
}

/**
 * Get all users
 *
 * @param {IGetUserQuery} query Query parameters
 * @returns List of users
 */
export async function getUsers(query: IGetUserQuery) {
  const data = await UserModel.UserModel.getUsers(query);

  return {
    message: "All users retrieved successfully",
    data,
  };
}

/**
 * Create user
 *
 * @param {Omit<IUser, "id">} user User data
 * @returns Newly created user object
 */
export async function createUser(user: Omit<IUser, "id">) {
  const userExists = await UserModel.UserModel.getUserByEmail(user.email);
  if (userExists)
    throw new ConflictError("User with same email already exists");

  const password = await bcrypt.hash(user.password, 10);

  const data = await UserModel.UserModel.createUser({
    id: getUUID(),
    ...user,
    password: password,
    role: ROLE.USER,
  });

  return {
    message: "User created successfully",
    data,
  };
}

/**
 * Update user
 *
 * @param {UUID} id User ID
 * @param {Partial<IUser>} userData User data
 * @returns User object
 * @throws `UnauthorizedError` Error if user is not authorized to update
 */
export async function updateUser(
  id: UUID,
  updatedBy: UUID,
  userData: Partial<IUser>,
) {
  const user = await getUserById(id);

  if (user.id !== id && user.role !== ROLE.ADMIN)
    throw new UnauthorizedError("You are not authorized to update this user");

  const { name, email, password } = userData;
  const newUserData: Partial<IUpdateUser> = {};

  newUserData.updatedAt = new Date();
  newUserData.updatedBy = updatedBy;

  if (name) newUserData.name = name;
  if (email) newUserData.email = email;
  if (password) newUserData.password = await bcrypt.hash(password, 10);

  await UserModel.UserModel.updateUser(id, newUserData);
  const data = await UserModel.UserModel.getUserById(id);

  return {
    message: "User updated successfully",
    data,
  };
}

/**
 * Delete user
 *
 * @param {UUID} id User ID
 * @returns User object
 * @throws `UnauthorizedError` Error if user is not authorized to delete
 */
export async function deleteUser(id: UUID) {
  const user = await getUserById(id);

  if (user.id !== id && user.role !== ROLE.ADMIN)
    throw new UnauthorizedError("You are not authorized to delete this user");

  await UserModel.UserModel.deleteUser(id);
  const { password, ...data } = user;

  return {
    message: "User deleted successfully",
    data,
  };
}

/**
 * Get user by email
 *
 * @param {string} email User email
 * @returns User object
 * @throws `NotFound` Error if user does not exists
 */
export function getUserByEmail(email: string): Promise<IUser> {
  const user = UserModel.UserModel.getUserByEmail(email);

  if (!user) {
    throw new NotFound(`User with email ${email} does not exists`);
  }

  return user;
}

/**
 * Get user by id
 *
 * @param {UUID} id User id
 * @returns User object
 * @throws `NotFound` Error if user does not exists
 */
export async function getUserById(id: UUID): Promise<IUser> {
  const user = await UserModel.UserModel.getUserById(id);

  if (!user) {
    throw new NotFound(`User with id ${id} does not exists`);
  }

  return user;
}
