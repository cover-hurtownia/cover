import express from "express";
import logger from "../logger.js";

export const router = express.Router();

export const get = async (request, response) => {
    response.status(200);
    response.render("contact", {
        meta: {
            url: request.protocol + '://' + request.get('host') + request.originalUrl,
            title: "Cover Hurtownia - Kontakt",
            description: "Skontaktuj się z nami!",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
};

export const post = async (request, response) => {
    const database = request.app.get("database");

    const query = database("client_messages").insert({ ...request.body, date: database.fn.now(), read: false });

    try { await query; }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);

        response.status(503);
        response.render('message', {
            meta: {
                url: request.protocol + '://' + request.get('host') + request.originalUrl,
                title: "Cover Hurtownia",
                description: "Błąd bazy danych",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 503: Błąd bazy danych. Spróbuj ponownie później.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });
    }

    response.status(200);
    response.render("contact", {
        meta: {
            url: request.protocol + '://' + request.get('host') + request.originalUrl,
            title: "Cover Hurtownia - Kontakt",
            description: "Skontaktuj się z nami!",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        message: {
            className: "is-success",
            title: "Sukces",
            content: "Wiadomość została wysłana pomyślnie!",
            buttons: [
                { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
            ]
        },
        session: request.session?.user
    });
};

router.get("", get);
router.post("", post);

export default router;