import dotenv from "dotenv";

dotenv.config();

export default {
    client: process.env.DATABASE_CLIENT,
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    },
    migrations: {
        extension: 'mjs',
        loadExtensions: ['.mjs']
    },
    pool: {
        min: 0
    }
};