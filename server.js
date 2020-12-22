import express, { request, response } from "express";
import session from "express-session";
import bodyParser from "body-parser";

import knex from "knex";
import connectSessionKnex from "connect-session-knex";
import knexFile from "./knexfile.js";
const KnexSessionStore = connectSessionKnex(session);

import bcrypt from "bcryptjs";


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

app.post("/api/login", async (request, response) => {
    const username = request.body.username ?? "";
    const password = request.body.password ?? "";

    try {
        const usersInDatabaseQuery = db('users').where({ username });
        const usersInDatabase = await usersInDatabaseQuery.catch(error => {
            console.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw "database error";
        });

        if (usersInDatabase.length != 1) {
            throw "invalid username or password";
        }

        const user = usersInDatabase[0];

        const passwordMatches = await bcrypt.compare(password, user.password_hash).catch(_ => {
            console.error("/api/login: hash comparison error");
            throw "internal error";
        });

        if (!passwordMatches) {
            throw "invalid username or password";
        }

        request.session.username = username;

        response.status(200);
        response.send({
            status: "ok"
        });
    }
    catch (error) {
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
});

app.post("/api/register", async (request, response) => {
    const username = request.body.username ?? "";
    const password = request.body.password ?? "";

    try {
        if (!Array.from(username).every(character => {
            const code = character.charCodeAt(0);
    
            const isNumeric = code > 47 && code < 58;
            const isUpperAlpha = code > 64 && code < 91;
            const isLowerAlpha = code > 96 && code < 123;
            const isUnderscore = character === "_";
    
            return isNumeric || isUpperAlpha || isLowerAlpha || isUnderscore;
        })) {
            throw "username can't contain characters other than 0-9/a-z/A-Z/_";
        };

        if (username.length < 3) {
            throw "username must consist of at least 3 characters";
        }
        
        if (password.length === 0) {
            throw "password can't be empty";
        };

        const salt = await bcrypt.genSalt().catch(_ => {
            console.error("/api/register: salt generation error");
            throw "internal error"
        });
        const passwordHash = await bcrypt.hash(password, salt).catch(_ => {
            console.error("/api/register: hashing error");
            throw "internal error";
        });

        const usersInDatabaseQuery = db('users').where({ username });
        const usersInDatabase = await usersInDatabaseQuery.catch(error => {
            console.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw "database error";
        });

        if (usersInDatabase.length != 0) { throw "username already exists" }

        const insertUserQuery = db('users').insert({ username, password_hash: passwordHash });

        await insertUserQuery.catch(error => {
            console.error(`/api/register: database error: ${insertUserQuery.toString()}: ${error}`);
            throw "database error";
        });

        request.session.username = username;

        response.status(200);
        response.send({
            status: "ok"
        });
    }
    catch (error) {
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
});

app.post("/api/logout", async (request, response) => {
    try {
        if (!request.session.hasOwnProperty("username")) {
            throw "already logged out";
        };

        request.session.destroy();

        response.status(200);
        response.send({
            status: "ok"
        });
    }
    catch (error) {
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
});

export default app;