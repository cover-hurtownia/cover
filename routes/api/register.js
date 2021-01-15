import bcrypt from "bcryptjs";
import logger from "../../logger.js";
import * as errorCodes from "../../www/js/common/errorCodes.js";
import { respond } from "../utilities.js";

export const register = respond(async request => {
    const database = request.app.get("database");

    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    if (!Array.from(username).every(character => {
        const code = character.charCodeAt(0);

        const isNumeric    = code > 47 && code < 58;
        const isUpperAlpha = code > 64 && code < 91;
        const isLowerAlpha = code > 96 && code < 123;
        const isUnderscore = character === "_";

        return isNumeric || isUpperAlpha || isLowerAlpha || isUnderscore;
    })) {
        throw [422, errorCodes.REGISTER_USERNAME_INVALID_CHARACTERS]
    };

    if (username.length < 3) {
        throw [422, errorCodes.REGISTER_USERNAME_TOO_SHORT];
    }

    if (username.length > 24) {
        throw [422, errorCodes.REGISTER_USERNAME_TOO_LONG];
    }
    
    if (password.length === 0) {
        throw [422, errorCodes.REGISTER_PASSWORD_EMPTY];
    };

    // Check if username already exists.
    const usersInDatabaseQuery = database('users').where({ username });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${usersInDatabaseQuery.toString()}`)

    const usersInDatabase = await usersInDatabaseQuery.catch(error => {
        logger.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    if (usersInDatabase.length != 0) { 
        throw [409, errorCodes.REGISTER_USERNAME_EXISTS];
    }

    // Generate salt for password hashing.
    const salt = await bcrypt.genSalt().catch(_ => {
        logger.error("/api/register: salt generation error");
        throw [500, errorCodes.INTERNAL_ERROR];
    });

    // Hash the password.
    const passwordHash = await bcrypt.hash(password, salt).catch(_ => {
        logger.error("/api/register: hashing error");
        throw [500, errorCodes.INTERNAL_ERROR];
    });

    // Insert new user into the database.
    const insertUserQuery = database('users').insert({ username, password_hash: passwordHash });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${insertUserQuery.toString()}`)

    await insertUserQuery.catch(error => {
        logger.error(`/api/register: database error: ${insertUserQuery.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    logger.info(`/api/register: new user registered: ${username}`);

    // Update session, generates a session cookie and sends it back.
    request.session.user = { username };

    return [200, { status: "ok", user: { username } }];
});