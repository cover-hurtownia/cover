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
import IAmFeelingLucky from "./routes/iamfeelinglucky.js";
import book from "./routes/book.js";
import logout from "./routes/logout.js";

import * as utils from "./www/js/utils.js"; 
import ranking from "./routes/ranking.js";

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
        showPrice: utils.showPrice,
        showTag: utils.showTag,
        showFormat: utils.showFormat,
        showDelivery: utils.showDelivery,
        showStatus: utils.showStatus,
        showDate: utils.showDate,
        showDatetime: utils.showDateTime,
        getStatusClassName: utils.getStatusClassName,
        hasRole: (role, user) => user.roles.includes(role) 
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
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia",
            description: "Lorem ipsum",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
});

app.get("/iamfeelinglucky", IAmFeelingLucky);
app.get('/book/:book_id', book);
app.post('/logout', logout);

app.get('/books', (request, response) => {
    response.render("books", {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - Książki",
            description: "Wyszukiwanie książek",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
});

app.get('/cart', (request, response) => {
    response.render("cart", {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - Koszyk",
            description: "Twój koszyk",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
});

app.get('/ranking', ranking);

app.get('/aboutUs', (request, response) => {
    response.render("aboutUs", {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - O nas",
            description: "O naszej hurtowni",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
});

app.get('/orders', (request, response) => {
    response.render("orders", {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - Moje zamówienia",
            description: "Wyszukiwanie zamówień",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
});

app.get('/admin/orders', (request, response) => {
    response.render("adminOrders", {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - Zamówienia klientów",
            description: "Wyszukiwanie zamówień",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
});

app.use('*', (request, response) => {
    response.status(404);
    response.render('message', {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - 404",
            description: "Błąd żądania",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        message: {
            className: "is-danger",
            title: "Błąd",
            content: "Błąd 404: Nie znaleziono strony.",
            buttons: [
                { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
            ]
        },
        session: request.session?.user
    });
});

export default app;