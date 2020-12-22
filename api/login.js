import bcrypt from "bcryptjs";

export const login = database => async (request, response) => {
    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    try {
        // Check if username exists.
        const usersInDatabaseQuery = database('users').where({ username });
        const usersInDatabase = await usersInDatabaseQuery.catch(error => {
            console.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw "database error";
        });

        if (usersInDatabase.length != 1) {
            throw "invalid username or password";
        }
 
        const user = usersInDatabase[0];

        // Compare the hashes.
        const passwordMatches = await bcrypt.compare(password, user.password_hash).catch(_ => {
            console.error("/api/login: hash comparison error");
            throw "internal error";
        });

        if (!passwordMatches) {
            throw "invalid username or password";
        }

        // Update session, generates a session cookie and sends it back.
        request.session.user = { username };

        response.status(200);
        response.cookie("session_username", request.session.user.username, { maxAge: request.session.cookie.maxAge, sameSite: true });
        response.send({
            status: "ok"
        });
    }
    catch (error) {
        // Send 404 (bad request) on any error.
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
};