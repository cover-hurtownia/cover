import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const putResource = table => respond(async request => {
    const database = request.app.get("database");
    
    const rows = Array.isArray(request.body) ? request.body : [request.body];

    if (rows.some(row => !(row instanceof Object) || row.id === undefined)) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

    const updatedRows = await database.transaction(async trx => {
        let updatedRows = 0;

        for (const { id, ...row } of rows) {
            if (id === undefined) continue;
            if (Object.keys(row).length === 0) continue;

            let query = trx(table).update(row).where({ id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
            updatedRows += await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
            });
    
            logger.info(`${request.method} ${request.originalUrl}: updated: ${id}`);
        }

        return updatedRows;
    });

    logger.info(`${request.method} ${request.originalUrl}: updated rows: ${updatedRows}`);

    return [200, {
        status: "ok",
        rows: updatedRows
    }];
});

export default putResource;