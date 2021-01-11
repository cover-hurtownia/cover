import winston from "winston";

export const logger = winston.createLogger();

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    silent: process.env.NODE_ENV === "test",
    level: process.env.LOG_LEVEL ?? "info"
}));

export default logger;