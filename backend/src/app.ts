import cors from "cors";
import helmet from "helmet";
import express from "express";
import rateLimiter from "express-rate-limit";

import router from "./routes/";
import loggerWithNameSpace from "./utils/logger";
import { requestLogger } from "./middleware/logger";
import { corsOptions, env, rateLimiterOptions } from "./config";
import { genericErrorHandler, notFoundError } from "./middleware/errorHandler";

const logger = loggerWithNameSpace(__filename);

// Initialize express
const app = express();

const limiter = rateLimiter(rateLimiterOptions);

// Middleware to secure the app by setting various HTTP response headers
app.use(helmet());

// Middleware to limit repeated requests to public APIs and/or endpoints
app.use(limiter);

// Middleware to enable CORS
app.use(cors(corsOptions))

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log incoming requests
app.use(requestLogger);

// Middleware to handle all routes
app.use(router);

// Middleware to handle not found routes
app.use(notFoundError);

// Middleware to handle generic errors
app.use(genericErrorHandler);

// Start the server
app.listen(env.port, () => {
  logger.info(`Server started listening on port: ${env.port}`)
});
