import express from "express";

import bcrypt from "bcryptjs";
import logger from "../logger.js";

export const router = express.Router();

export const get = async (request, response) => {
    response.status(200);
    response.render("login", {
        meta: {
            url: request.protocol + '://' + request.get('host') + request.originalUrl,
            title: "Cover Hurtownia - Logowanie/Rejestracja",
            description: "Logowanie/Rejestracja",
            image: "/assets/banner.png",
            cookies: request.cookies
        },
        session: request.session?.user
    });
};

export const post = async (request, response) => {
    const database = request.app.get("database");

    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    // Check if username exists.
    const usersInDatabaseQuery = database('users').where({ username });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${usersInDatabaseQuery.toString()}`)

    let usersInDatabase;
    try { usersInDatabase = await usersInDatabaseQuery; }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        
        response.status(503);
        response.render("login", {
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
    };

    if (usersInDatabase.length != 1) {
        response.status(401);
        response.render("login", {
            meta: {
                url: request.protocol + '://' + request.get('host') + request.originalUrl,
                title: "Cover Hurtownia",
                description: "Błąd logowania",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika nie istnieje lub podane hasło jest nieprawidłowe.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });
    }

    const user = usersInDatabase[0];

    // Compare the hashes.
    let passwordMatches 
    try { passwordMatches = await bcrypt.compare(password, user.password_hash); }
    catch (error) {
        response.status(500);
        response.render("login", {
            meta: {
                url: request.protocol + '://' + request.get('host') + request.originalUrl,
                title: "Cover Hurtownia",
                description: "Błąd logowania",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 500: Błąd serwera. Spróbuj ponownie później.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });
    };

    if (!passwordMatches) {
        response.status(401);
        response.render("login", {
            meta: {
                url: request.protocol + '://' + request.get('host') + request.originalUrl,
                title: "Cover Hurtownia",
                description: "Błąd logowania",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Nazwa użytkownika nie istnieje lub podane hasło jest nieprawidłowe.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });
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
        
        response.status(503);
        response.render("login", {
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
    };

    // Update session, generates a session cookie and sends it back.
    request.session.user = { ...user, roles };
    response.redirect("/");
};

router.get("", get);
router.post("", post);

export default router;