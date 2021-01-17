import logger from "../logger.js";

export const authenticated = async (request, response, next) => {
    if (request.session.hasOwnProperty("user")) next();
    else {
        logger.warn(`${request.method} ${request.originalUrl}: [401]`);

        response.status(401);
        response.send({
            status: "error",
            error: {
                userMessage: "wymagane zalogowanie",
                devMessage: "not authenticated"
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

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${rolesQuery.toString()}`);

        const roles = await rolesQuery.then(roles => roles.map(({ name }) => name)).catch(error => {
            logger.error(`/api/roles: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (roles.includes(requiredRole)) next();
        else throw [403, { userMessage: "brak uprawnień", devMessage: `role required: ${requiredRole}` }];
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`${request.method} ${request.originalUrl}: ${error.toString()}`);

            response.status(500);
            response.send({
                status: "error",
                error: {
                    userMessage: "błąd serwera",
                    devMessage: error.toString()
                }
            });
        }
        else {
            const [status, errorBody] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${JSON.stringify(errorBody)}`);

            const body = {
                status: "error",
                error: errorBody
            };

            response.status(status);
            response.send(body);
        }
    }
}];

export const adminAuthorization = roleAuthorization("ADMIN");

export const respond = handler => async (request, response) => {
    logger.debug(`${request.method} ${request.originalUrl}`);

    try {
        const [status, body] = await handler(request);

        response.status(status);
        response.send(body);
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`${request.method} ${request.originalUrl}: ${error.toString()}`);

            response.status(500);
            response.send({
                status: "error",
                error: {
                    userMessage: "błąd serwera",
                    devMessage: error.toString()
                }
            });
        }
        else {
            const [status, errorBody] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${JSON.stringify(errorBody)}`);

            const body = {
                status: "error",
                error: errorBody
            };

            response.status(status);
            response.send(body);
        }
    }
}