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
    format.colorize({ all: true }),
  ),
  transports: [
    // Transport to write logs to console
    new winston.transports.Console(),

    // Transport to write logs to a file
    new winston.transports.File({
      filename: logPath,
    }),
  ],
});

const loggerWithNameSpace = function (namespace: string) {
  return logger.child({ namespace });
};

export default loggerWithNameSpace;
