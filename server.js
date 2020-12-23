import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

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



const db = knex(knexFile[process.env.NODE_ENV ?? "development"]);

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
app.use((request, response, next) => {
    // If session contains "user" key, then the user is probably logged in.
    if (request.session.hasOwnProperty("user")) {
        // Send a non-samesite cookie for client.
        response.cookie("session_user", JSON.stringify({ username: request.session.user.username }), { maxAge: request.session.cookie.maxAge, sameSite: true });
    }
    // Otherwise, they are probably not logged in, so remove session cookies just in case.
    else {
        // Send Set-Cookie header to clear cookies only if they were present.
        if ("session" in request.cookies) {
            response.clearCookie("session");
        }

        if ("session_user" in request.cookies) {
            response.clearCookie("session_user");
        }
    }

    next();
});

app.post("/api/echo", (request, response) => {
    response.send({
        message: "Hello from /api/echo.",
        data: request.body
    });
});

app.post("/api/login", login(db));
app.post("/api/register", register(db));
app.post("/api/logout", logout(db));

app.set('database', db);

export default app;