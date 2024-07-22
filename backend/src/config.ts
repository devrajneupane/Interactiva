import { CorsOptions } from "cors";
import { Options } from "express-rate-limit";

import { ALLOWED_ORIGINS } from "./constant/constants";

export const env = {
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiryMS: +process.env.ACCESS_TOKEN_EXPIRY_MS!,
    refreshTokenExpiryMS: +process.env.REFRESH_TOKEN_EXPIRY_MS!,
  },
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  },
  ollama: {
    host: process.env.OLLAMA_HOST,
  },
};

export const rateLimiterOptions: Partial<Options> = {
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many Request",
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed"));
    }
  },
};
