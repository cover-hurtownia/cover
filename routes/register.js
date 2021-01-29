import express from "express";

import bcrypt from "bcryptjs";
import logger from "../logger.js";
import { render } from "./utilities.js";

export const router = express.Router();

export const get = render(async _ => [200, "login", {
    meta: {
        title: "Cover Hurtownia - Logowanie/Rejestracja",
        description: "Logowanie/Rejestracja"
    }
}]);

export const post = render(async (request, response) => {
    const database = request.app.get("database");

    const username = request.body.username ?? "";
    const password = request.body.password ?? "";

    if (!Array.from(username).every(character => {
        const code = character.charCodeAt(0);

        const isNumeric    = code > 47 && code < 58;
        const isUpperAlpha = code > 64 && code < 91;
        const isLowerAlpha = code > 96 && code < 123;
        const isUnderscore = character === "_";

        return isNumeric || isUpperAlpha || isLowerAlpha || isUnderscore;
    })) {
        throw [422, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd rejestracji"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika musi się składać tylko ze znaków alfanumerycznych i podkreślnika."
            }
        }];
    };

    if (username.length < 3) {
        throw [422, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd rejestracji"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika musi składać się z minimalnie 3 znaków."
            }
        }];
    }

    if (username.length > 24) {
        throw [422, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd rejestracji"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika musi składać się z maksymalnie 24 znaków."
            }
        }];
    }
    
    if (password.length === 0) {
        throw [422, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd rejestracji"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Hasło nie może być puste."
            }
        }];
    };

    // Check if username already exists.
    const usersInDatabaseQuery = database('users').where({ username });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${usersInDatabaseQuery.toString()}`)

    const usersInDatabase = await usersInDatabaseQuery.catch(error => {
        logger.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        
        throw [503, "login", {
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
    });

    if (usersInDatabase.length != 0) { 
        throw [409, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd rejestracji"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Użytkownik o podanej nazwe już istnieje."
            }
        }];
    }

    // Generate salt for password hashing.
    const salt = await bcrypt.genSalt().catch(error => {
        logger.error("/api/register: salt generation error");
        
        throw [500, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd serwera"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 500: Błąd serwera. Spróbuj ponownie później."
            }
        }];
    });

    // Hash the password.
    const passwordHash = await bcrypt.hash(password, salt).catch(error => {
        logger.error("/api/register: hashing error");
        
        throw [500, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd serwera"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 500: Błąd serwera. Spróbuj ponownie później."
            }
        }];
    });

    // Insert new user into the database.
    const insertUserQuery = database('users').insert({ username, password_hash: passwordHash });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${insertUserQuery.toString()}`)

    const [id] = await insertUserQuery.catch(error => {
        logger.error(`/api/register: database error: ${insertUserQuery.toString()}: ${error}`);
        
        throw [503, "login", {
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
    });

    logger.info(`/api/register: new user registered: ${username}`);

    // Update session, generates a session cookie and sends it back.
    request.session.user = { id, username, roles: [] };
    response.redirect("/");
});

router.get("", get);
router.post("", post);

export default router;