import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const deleteResourceById = (table, param) => respond(async request => {
    const database = request.app.get("database");
    
    const id = request.params[param];

    let query = database(table).delete().where({ id });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const deletedRows = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    if (deletedRows === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

    return [200, {
        status: "ok",
        rows: deletedRows
    }];
});

export default deleteResourceById;