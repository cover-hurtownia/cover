import winston from "winston";

export const logger = winston.createLogger();

if (process.env.NODE_ENV !== "test") {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        )
    }));
}

export default logger;