import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const putResourceById = (table, param) => respond(async request => {
    const database = request.app.get("database");
    
    const id = request.params[param];

    let query = database(table).update(request.body).where({ id });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const updatedRows = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    if (updatedRows === 0) throw [404, {
        userMessage: `zasób o id ${id} nie istnieje`,
        devMessage: `resource with id ${id} doesn't exist`
    }];

    return [200, { status: "ok" }];
});

export default putResourceById;