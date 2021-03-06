import bcrypt from "bcryptjs";
import logger from "../../logger.js";

import { respond } from "../utilities.js";

export const login = respond(async request => {
    const database = request.app.get("database");

    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    // Check if username exists.
    const usersInDatabaseQuery = database('users').where({ username });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${usersInDatabaseQuery.toString()}`)

    const usersInDatabase = await usersInDatabaseQuery.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    if (usersInDatabase.length != 1) {
        throw [401, { userMessage: "nazwa użytkownika nie istnieje lub podane hasło jest nieprawidłowe", devMessage: "username already exists" }];
    }

    const user = usersInDatabase[0];

    // Compare the hashes.
    const passwordMatches = await bcrypt.compare(password, user.password_hash).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: hash comparison error`);
        throw [500, { userMessage: "błąd serwera", devMessage: error.toString() }];
    });

    if (!passwordMatches) {
        throw [401, { userMessage: "nazwa użytkownika nie istnieje lub podane hasło jest nieprawidłowe", devMessage: "password doesn't match" }];
    }

    logger.info(`${request.method} ${request.originalUrl}: user logged in: ${username}`);

    const rolesQuery = database
        .select("roles.role")
        .from("user_roles")
        .join("users", "users.id", "user_roles.user_id")
        .join("roles", "roles.id", "user_roles.role_id")
        .where("users.username", "=", username);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${rolesQuery.toString()}`);

    const roles = await rolesQuery.then(roles => roles.map(({ role }) => role)).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    // Update session, generates a session cookie and sends it back.
    request.session.user = { ...user, roles };

    return [200, {
        status: "ok",
        user: { username, roles }
    }];
});