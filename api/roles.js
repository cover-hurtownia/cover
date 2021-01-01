export const roles = database => async (request, response) => {
    try {
        if (request.session.hasOwnProperty("user")) {
            const rolesQuery = database
                .select("roles.name")
                .from("user_roles")
                .join("users", "users.id", "user_roles.user_id")
                .join("roles", "roles.id", "user_roles.role_id")
                .where("users.username", "=", request.session.user.username);

            const roles = await rolesQuery.then(roles => roles.map(({ name }) => name)).catch(error => {
                console.error(`/api/roles: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
                throw "database error";
            });

            response.status(200);
            response.send({
                status: "ok",
                roles
            });
        }
        else throw "not logged in";
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