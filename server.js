import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import handlebars from "express-handlebars";

import knex from "knex";
import connectSessionKnex from "connect-session-knex";
import knexFile from "./knexfile.js";
const KnexSessionStore = connectSessionKnex(session);

import logger from "./logger.js";
import { router as api } from "./routes/api/router.js";
import { router as images } from "./routes/images.js";
import search from "./routes/search.js";
import book from "./routes/book.js";

const SESSION_COOKIE_NAME = "session";

if (process.env.SESSION_SECRET === undefined) {
    logger.warn("SESSION_SECRET not present in .env");
}

const SESSION_SECRET      = process.env.SESSION_SECRET ?? "FOOBAR";
const SESSION_MAX_AGE     = 60 * 60 * 1000;



const db = knex(knexFile);

const app = express();

app.set("database", db);
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({
    helpers: {
        showPrice: price => `${(Number(price) / 100.0).toFixed(2)}zł`
    }
}));
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

app.get('/', (request, response) => {
    response.render("home", {
        meta: {
            title: "Hurtownia książek",
            description: "Lorem ipsum",
            image: "/assets/banner.png"
        }
    });
});

app.get('/search', search);
app.get('/book/:book_id', book);

app.use('*', (request, response) => {
    response.status(404);
    response.render('error', {
        meta: {
            title: "Hurtownia książek",
            description: "Błąd 404",
            image: "/assets/banner.png"
        },
        error: {
            title: "Błąd 404",
            message: "Nie znaleziono strony"
        }
    });
});

export default app;