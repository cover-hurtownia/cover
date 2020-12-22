import express, { request, response } from "express";
import session from "express-session";
import bodyParser from "body-parser";

import knex from "knex";
import connectSessionKnex from "connect-session-knex";
import knexFile from "./knexfile.js";
const KnexSessionStore = connectSessionKnex(session);

import { login } from "./api/login.js";
import { register } from "./api/register.js";
import { logout } from "./api/logout.js";


const SESSION_COOKIE_NAME = "session";
const SESSION_SECRET      = "FOOBAR";
const SESSION_MAX_AGE     = 60 * 60 * 1000;



const db = knex(knexFile);

const app = express();

app.use(session({
    secret: SESSION_SECRET,
    store: new KnexSessionStore({ knex: db }),
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static("www"));

app.post("/api/echo", (request, response) => {
    response.send({
        message: "Hello from /api/echo.",
        data: request.body
    });
});

app.post("/api/login", login(db));
app.post("/api/register", register(db));
app.post("/api/logout", logout(db));

export default app;