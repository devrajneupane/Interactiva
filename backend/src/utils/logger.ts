import * as path from "path";
import winston, { format } from "winston";

const logPath = path.join(__dirname, "../../logs/app.log");
const logFormat = format.printf((info) => {
  const formattedNamespace = info.metadata.namespace || "";

  return `${info.metadata.timestamp} [${info.level}] [${formattedNamespace}]: ${info.message}`;
});

const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.metadata(),
    logFormat,
  ),
  transports: [
    // Transport to write logs to console
    new winston.transports.Console({
      format: format.colorize({ all: true }),
    }),

    // Transport to write logs to a file
    new winston.transports.File({
      filename: logPath,
    }),
  ],
});

export const loggerWithNameSpace = function (namespace: string) {
  return logger.child({ namespace });
};

// TODO: remove this default export
export default loggerWithNameSpace;
