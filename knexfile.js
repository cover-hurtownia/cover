import dotenv from "dotenv";
dotenv.config();

export default {
    client: process.env.DATABASE_CLIENT,
    connection: process.env.DATABASE_IN_MEMORY === "true" ? ":memory:" : {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        filename: process.env.DATABASE_FILENAME
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'mjs',
        loadExtensions: ['.mjs']
    },
    pool: {
        min: 0
    }
};