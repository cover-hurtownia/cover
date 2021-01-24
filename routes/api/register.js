import bcrypt from "bcryptjs";
import logger from "../../logger.js";
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
        throw [422, {
            userMessage: "nazwa użytkownika musi się składać tylko ze znaków alfanumerycznych i podkreślnika",
            devMessage: "invalid username"
        }];
    };

    if (username.length < 3) {
        throw [422, {
            userMessage: "nazwa użytkownika nie może mieć więcej niż 3 znaków",
            devMessage: "username too short"
        }];
    }

    if (username.length > 24) {
        throw [422, {
            userMessage: "nazwa użytkownika nie może mieć więcej niż 24 znaków",
            devMessage: "username too long"
        }];
    }
    
    if (password.length === 0) {
        throw [422, {
            userMessage: "hasło nie może być puste",
            devMessage: "empty password"
        }];
    };

    // Check if username already exists.
    const usersInDatabaseQuery = database('users').where({ username });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${usersInDatabaseQuery.toString()}`)

    const usersInDatabase = await usersInDatabaseQuery.catch(error => {
        logger.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    if (usersInDatabase.length != 0) { 
        throw [409, {
            userMessage: "użytkownik z taką nazwą użytkownika już istnieje",
            devMessage: "username already exists"
        }];
    }

    // Generate salt for password hashing.
    const salt = await bcrypt.genSalt().catch(error => {
        logger.error("/api/register: salt generation error");
        throw [500, {
            userMessage: "błąd serwera",
            devMessage: error.toString()
        }];
    });

    // Hash the password.
    const passwordHash = await bcrypt.hash(password, salt).catch(error => {
        logger.error("/api/register: hashing error");
        throw [500, {
            userMessage: "błąd serwera",
            devMessage: error.toString()
        }];
    });

    // Insert new user into the database.
    const insertUserQuery = database('users').insert({ username, password_hash: passwordHash });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${insertUserQuery.toString()}`)

    const [id] = await insertUserQuery.catch(error => {
        logger.error(`/api/register: database error: ${insertUserQuery.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    logger.info(`/api/register: new user registered: ${username}`);

    // Update session, generates a session cookie and sends it back.
    request.session.user = { id, username, roles: [] };

    return [200, { status: "ok", user: { username, roles: [] } }];
});