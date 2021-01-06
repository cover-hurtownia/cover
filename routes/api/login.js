import bcrypt from "bcryptjs";
import logger from "../../logger.js";

export const login = async (request, response) => {
    const database = request.app.get("database");

    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    try {
        // Check if username exists.
        const usersInDatabaseQuery = database('users').where({ username });
        const usersInDatabase = await usersInDatabaseQuery.catch(error => {
            logger.error(`/api/login: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw "database error";
        });

        if (usersInDatabase.length != 1) {
            throw "invalid username or password";
        }
 
        const user = usersInDatabase[0];

        // Compare the hashes.
        const passwordMatches = await bcrypt.compare(password, user.password_hash).catch(_ => {
            logger.error("/api/login: hash comparison error");
            throw "internal error";
        });

        if (!passwordMatches) {
            throw "invalid username or password";
        }

        // Update session, generates a session cookie and sends it back.
        request.session.user = { username };

        response.status(200);
        response.send({
            status: "ok",
            user: { username }
        });
    }
    catch (error) {
        // Send 400 (bad request) on any error.
        logger.warn(`/api/login: ${error}`);
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
};