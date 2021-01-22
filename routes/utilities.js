import logger from "../logger.js";
import * as errorCodes from "../www/js/common/errorCodes.js";

export const authenticated = async (request, response, next) => {
    if (request.session.hasOwnProperty("user")) next();
    else {
        logger.warn(`${request.method} ${request.originalUrl}: [401]`);

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

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${rolesQuery.toString()}`);

        const roles = await rolesQuery.then(roles => roles.map(({ name }) => name)).catch(error => {
            logger.error(`/api/roles: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
        });

        if (roles.includes(requiredRole)) next();
        else throw [403, errorCodes.NOT_AUTHORIZED];
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

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
                    code: errorCodes.UNKNOWN_ERROR,
                    message: error.toString()
                }
            });
        }
        else {
            const [status = 500, errorCode = errorCodes.UNKNOWN_ERROR, details = {}] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

            const body = {
                status: "error",
                error: {
                    code: errorCode,
                    message: errorCodes.asMessage(errorCode),
                }
            };

            if (details) body.error.details = details;

            response.status(status);
            response.send(body);
        }
    }
}