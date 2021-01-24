import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const deleteResourceById = (table, param) => respond(async request => {
    const database = request.app.get("database");
    
    const id = request.params[param];

    await database.transaction(async trx => {
        let query = trx(table).delete().where({ id });

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
        const deletedRows = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (deletedRows === 0) throw [404, {
            userMessage: `zasób o id ${id} nie istnieje`,
            devMessage: `resource with id ${id} doesn't exist`
        }];
    });

    return [200, { status: "ok" }];
});

export default deleteResourceById;