import * as fs from "fs";
import crypto, { UUID } from "crypto";

import { sign } from "jsonwebtoken";

import { env } from "../config";
import { IUser } from "../interface/User";

/**
 * Read JSON file and parse content
 *
 * @param filePath  Path to the JSON file
 * @returns Promise with JSON content
 * @throws File read error or JSON parse error
 */
export function readJsonFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (jsonError) {
        reject(jsonError);
      }
    });
  });
}

/**
 * Write JSON object to file
 *
 * @param filePath Path to the JSON file
 * @param jsonObject JSON object to write
 * @returns Promise
 * @throws File write error
 */
export function writeJsonFile(
  filePath: string,
  jsonObject: any,
): Promise<void> {
  const jsonString = JSON.stringify(jsonObject, null, 2);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, jsonString, "utf-8", (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * Generate UUID
 *
 * @returns UUID
 */
export function getUUID(): UUID {
  return crypto.randomUUID();
}

/**
 * Sign payload with JWT secret
 *
 * @param payload User data
 * @returns accessToken and refreshToken
 */
export function signPayload(payload: Omit<IUser, "password">): {
  accessToken: string;
  refreshToken: string;
  error?: string;
} {
  const accessToken = sign(payload, env.jwt.secret!, {
    expiresIn: env.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, env.jwt.secret!, {
    expiresIn: env.jwt.refreshTokenExpiryMS,
  });

  return {
    accessToken,
    refreshToken,
  };
}
