import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const postResource = table => respond(async request => {
    const database = request.app.get("database");
    
    const rows = Array.isArray(request.body) ? request.body : [request.body];

    if (rows.some(row => !(row instanceof Object))) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

    const ids = await database.transaction(async trx => {
        const ids = [];

        for (const row of rows) {
            let query = trx(table).insert(row);

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);
    
            const [id] = await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
            });
    
            logger.info(`${request.method} ${request.originalUrl}: inserted: ${id}`);
            ids.push(id);
        }

        return ids;
    });

    logger.info(`${request.method} ${request.originalUrl}: inserted ids: ${ids.toString()}`);

    return [201, {
        status: "ok",
        ids
    }];
});

export default postResource;