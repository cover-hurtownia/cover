import { authenticated } from "../utilities.js";
import { respond } from "../utilities.js";

export const session = [authenticated, respond(async request => {
    const database = request.get("database");
    
    const rolesQuery = database
        .select("roles.role")
        .from("user_roles")
        .join("users", "users.id", "user_roles.user_id")
        .join("roles", "roles.id", "user_roles.role_id")
        .where("users.username", "=", request.session.user.username);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${rolesQuery.toString()}`);

    const roles = await rolesQuery.then(roles => roles.map(({ name }) => name)).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${usersInDatabaseQuery.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        user: { username: request.session.user.username, roles }
    }];
})];