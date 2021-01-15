import bcrypt from "bcryptjs";
import logger from "../../logger.js";
import * as errorCodes from "../../www/js/common/errorCodes.js";
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
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    if (usersInDatabase.length != 1) {
        throw [401, errorCodes.LOGIN_INVALID_USERNAME_OR_PASSWORD];
    }

    const user = usersInDatabase[0];

    // Compare the hashes.
    const passwordMatches = await bcrypt.compare(password, user.password_hash).catch(_ => {
        logger.error(`${request.method} ${request.originalUrl}: hash comparison error`);
        throw [500, errorCodes.INTERNAL_ERROR];
    });

    if (!passwordMatches) {
        throw [401, errorCodes.LOGIN_INVALID_USERNAME_OR_PASSWORD];
    }

    logger.info(`${request.method} ${request.originalUrl}: user logged in: ${username}`);

    // Update session, generates a session cookie and sends it back.
    request.session.user = { username };

    return [200, {
        status: "ok",
        user: { username }
    }];
});