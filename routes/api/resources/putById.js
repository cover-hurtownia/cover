import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const putResourceById = (table, param) => respond(async request => {
    const database = request.app.get("database");
    
    const id = request.params[param];

    let query = database(table).update(request.body).where({ id });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const updatedRows = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    if (updatedRows === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

    return [200, {
        status: "ok",
        rows: updatedRows
    }];
});

export default putResourceById;