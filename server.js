import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
// import handlebars from "express-handlebars";

import knex from "knex";
import connectSessionKnex from "connect-session-knex";
import knexFile from "./knexfile.js";
const KnexSessionStore = connectSessionKnex(session);

import logger from "./logger.js";
import { router as api } from "./routes/api/router.js";
import { router as images } from "./routes/images.js";

const SESSION_COOKIE_NAME = "session";

if (process.env.SESSION_SECRET === undefined) {
    logger.warn("SESSION_SECRET not present in .env");
}

const SESSION_SECRET      = process.env.SESSION_SECRET ?? "FOOBAR";
const SESSION_MAX_AGE     = 60 * 60 * 1000;



const db = knex(knexFile);

const app = express();

app.set("database", db);
// app.set("view engine", "handlebars");
// app.engine("handlebars", handlebars({
//     helpers: {
//         showPrice: price => `${(Number(price) / 100.0).toFixed(2)}zł`
//     }
// }));
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
app.use(fileUpload());
app.use("/", express.static("www"));

app.use("/api", api);
app.use("/images", images);

export default app;