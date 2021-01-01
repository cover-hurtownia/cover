import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import knex from "knex";
import connectSessionKnex from "connect-session-knex";
import knexFile from "./knexfile.js";
const KnexSessionStore = connectSessionKnex(session);

import * as API from "./api/index.js";

const SESSION_COOKIE_NAME = "session";
const SESSION_SECRET      = "FOOBAR";
const SESSION_MAX_AGE     = 60 * 60 * 1000;



const db = knex(knexFile[process.env.NODE_ENV ?? "development"]);
await db.raw('PRAGMA foreign_keys = ON');

const app = express();

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

app.post("/api/echo", (request, response) => {
    response.send({
        message: "Hello from /api/echo.",
        data: request.body
    });
});

app.post("/api/login", API.login(db));
app.post("/api/register", API.register(db));
app.post("/api/logout", API.logout(db));
app.post("/api/session", API.session(db));
app.post("/api/roles", API.roles(db));

app.set('database', db);

export default app;