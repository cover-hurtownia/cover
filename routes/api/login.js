import bcrypt from "bcryptjs";
import logger from "../../logger.js";
import * as errorCodes from "../../www/js/common/errorCodes.js";

export const login = async (request, response) => {
    const database = request.app.get("database");

    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    try {
        // Check if username exists.
        const usersInDatabaseQuery = database('users').where({ username });
        const usersInDatabase = await usersInDatabaseQuery.catch(error => {
            logger.error(`/api/login: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (usersInDatabase.length != 1) {
            throw [401, errorCodes.LOGIN_INVALID_USERNAME_OR_PASSWORD];
        }
 
        const user = usersInDatabase[0];

        // Compare the hashes.
        const passwordMatches = await bcrypt.compare(password, user.password_hash).catch(_ => {
            logger.error("/api/login: hash comparison error");
            throw [500, errorCodes.INTERNAL_ERROR];
        });

        if (!passwordMatches) {
            throw [401, errorCodes.LOGIN_INVALID_USERNAME_OR_PASSWORD];
        }

        logger.info(`/api/login: user logged in: ${username}`);

        // Update session, generates a session cookie and sends it back.
        request.session.user = { username };

        response.status(200);
        response.send({
            status: "ok",
            user: { username }
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`/api/login: [${status}]: ${errorCodes.asMessage(errorCode)}`);

        response.status(status);
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
};