import bcrypt from "bcryptjs";

export const register = database => async (request, response) => {
    const username = request.body.username ?? ""; // If no username in request body, then default to empty string.
    const password = request.body.password ?? ""; // If no password in request body, then default to empty string.

    try {
        // If NOT every character in username is alphanumeric or underscore, then throw error.
        if (!Array.from(username).every(character => {
            const code = character.charCodeAt(0);
    
            const isNumeric    = code > 47 && code < 58;
            const isUpperAlpha = code > 64 && code < 91;
            const isLowerAlpha = code > 96 && code < 123;
            const isUnderscore = character === "_";
    
            return isNumeric || isUpperAlpha || isLowerAlpha || isUnderscore;
        })) {
            throw "username can't contain characters other than 0-9/a-z/A-Z/_";
        };

        if (username.length < 3) {
            throw "username must consist of at least 3 characters";
        }
        
        if (password.length === 0) {
            throw "password can't be empty";
        };

        // Check if username already exists.
        const usersInDatabaseQuery = database('users').where({ username });
        const usersInDatabase = await usersInDatabaseQuery.catch(error => {
            console.error(`/api/register: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw "database error";
        });

        if (usersInDatabase.length != 0) { throw "username already exists" }

        // Generate salt for password hashing.
        const salt = await bcrypt.genSalt().catch(_ => {
            console.error("/api/register: salt generation error");
            throw "internal error"
        });

        // Hash the password.
        const passwordHash = await bcrypt.hash(password, salt).catch(_ => {
            console.error("/api/register: hashing error");
            throw "internal error";
        });

        // Insert new user into the database.
        const insertUserQuery = database('users').insert({ username, password_hash: passwordHash });

        await insertUserQuery.catch(error => {
            console.error(`/api/register: database error: ${insertUserQuery.toString()}: ${error}`);
            throw "database error";
        });

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