import * as errorCodes from "../www/js/common/errorCodes.js";

export const authenticated = async (request, response, next) => {
    if (request.session.hasOwnProperty("user")) next();
    else {
        response.status(401);
        response.send({
            status: "error",
            error: {
                code: errorCodes.NOT_AUTHENTICATED,
                message: errorCodes.asMessage(errorCodes.NOT_AUTHENTICATED)
            }
        });
    }
};

export const roleAuthorization = requiredRole => [authenticated, async (request, response, next) => {
    const database = request.app.get("database");

    try {
        const rolesQuery = database
            .select("roles.name")
            .from("user_roles")
            .join("users", "users.id", "user_roles.user_id")
            .join("roles", "roles.id", "user_roles.role_id")
            .where("users.username", "=", request.session.user.username);

        const roles = await rolesQuery.then(roles => roles.map(({ name }) => name)).catch(error => {
            logger.error(`/api/roles: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (roles.includes(requiredRole)) next();
        else throw [403, errorCodes.NOT_AUTHORIZED];
    }
    catch ([status, errorCode]) {
        response.status(status)
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
}];