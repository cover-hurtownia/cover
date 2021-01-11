import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

export default {
    client: process.env.DATABASE_CLIENT ? process.env.DATABASE_CLIENT : "sqlite3",
    connection: process.env.DATABASE_IN_MEMORY === "true" ? ":memory:" : {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        filename: process.env.DATABASE_FILENAME ? process.env.DATABASE_FILENAME : "database.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'mjs',
        loadExtensions: ['.mjs']
    },
    pool: {
        min: 0
    },
    log: {
        warn(message) {
            logger.warn(`knex: ${message}`);
        },
        error(message) {
            logger.error(`knex: ${message}`);
        },
        debug(message) {
            logger.debug(`knex: ${message}`);
        },
    }
};