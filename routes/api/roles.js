import logger from "../../logger.js";
import { authenticated } from "../utilities.js";
import * as errorCodes from "../../www/js/common/errorCodes.js";

export const roles = [authenticated, async (request, response) => {
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

        response.status(200);
        response.send({
            status: "ok",
            roles
        });
    }
    catch (error) {
        logger.warn(`/api/roles: [${status}]: ${errorCodes.asMessage(errorCode)}`);

        response.status(status);
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
}];