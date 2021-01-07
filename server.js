import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import knex from "knex";
import connectSessionKnex from "connect-session-knex";
import knexFile from "./knexfile.js";
const KnexSessionStore = connectSessionKnex(session);

import logger from "./logger.js";
import { router as api } from "./routes/api/router.js";

const SESSION_COOKIE_NAME = "session";

if (process.env.SESSION_SECRET === undefined) {
    logger.warn("SESSION_SECRET not present in .env");
}

const SESSION_SECRET      = process.env.SESSION_SECRET ?? "FOOBAR";
const SESSION_MAX_AGE     = 60 * 60 * 1000;



const db = knex(process.env.NODE_ENV !== "test" ? knexFile : {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
        extension: 'mjs',
        loadExtensions: ['.mjs']
    }
});

const app = express();

app.set("database", db);
app.use(session({
    secret: SESSION_SECRET,
    store: new KnexSessionStore({ knex: db, createtable: false }),
    name: SESSION_COOKIE_NAME,
    rolling: true,
    resave: true,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        httpOnly: true,
        secure: false,
        maxAge: SESSION_MAX_AGE
    }
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static("www"));

app.use("/api", api);

export default app;