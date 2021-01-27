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

    const usersInDatabaseQuery = database('users').where({ username });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${usersInDatabaseQuery.toString()}`)

    let usersInDatabase;
    try { usersInDatabase = await usersInDatabaseQuery; }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        
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
    };

    if (usersInDatabase.length != 1) {
        throw [401, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd logowania"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika nie istnieje lub podane hasło jest nieprawidłowe."
            }
        }];
    }

    const user = usersInDatabase[0];

    let passwordMatches 
    try { passwordMatches = await bcrypt.compare(password, user.password_hash); }
    catch (error) {
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
    };

    if (!passwordMatches) {
        throw [401, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd logowania"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika nie istnieje lub podane hasło jest nieprawidłowe."
            }
        }];
    }

    logger.info(`${request.method} ${request.originalUrl}: user logged in: ${username}`);

    const rolesQuery = database
        .select("roles.role")
        .from("user_roles")
        .join("users", "users.id", "user_roles.user_id")
        .join("roles", "roles.id", "user_roles.role_id")
        .where("users.username", "=", username);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${rolesQuery.toString()}`);

    let roles;
    try { roles = await rolesQuery.then(roles => roles.map(({ role }) => role)); }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        
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
    };

    request.session.user = { ...user, roles };
    response.redirect("/");
});

router.get("", get);
router.post("", post);

export default router;