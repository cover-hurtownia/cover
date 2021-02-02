import express from "express";
import logger from "../logger.js";
import { render } from "./utilities.js";

export const router = express.Router();

export const get = render(async _ => [200, "contact", {
    meta: {
        title: "Cover Hurtownia - Kontakt",
        description: "Skontaktuj się z nami!"
    }
}]);

export const post = render(async request => {
    const database = request.app.get("database");

    const query = database("client_messages").insert({
        name: request.body.name,
        email: request.body.email,
        title: request.body.title,
        message: request.body.message,
        date: database.fn.now(),
        read: false
    });

    try { await query; }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);

        throw [503, "contact", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd bazy danych"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 503: Błąd bazy danych. Spróbuj ponownie później."
            }
        }];
    }

    return [200, "contact", {
        meta: {
            title: "Cover Hurtownia - Kontakt",
            description: "Skontaktuj się z nami!"
        },
        message: {
            className: "is-success",
            title: "Sukces",
            content: "Wiadomość została wysłana pomyślnie!",
            buttons: [
                { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
            ]
        }
    }];
});

router.get("", get);
router.post("", post);

export default router;