import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const putResource = table => respond(async request => {
    const database = request.app.get("database");
    
    const rows = Array.isArray(request.body) ? request.body : [request.body];

    for (let i = 0; i < rows.length; ++i) {
        const row = rows[i];

        if (!(row instanceof Object)) throw [400, {
            userMessage: "błąd formularza",
            devMessage: `data at index ${i} is not an object`
        }];
    } 

    const updatedRows = await database.transaction(async trx => {
        let updatedRows = 0;

        for (const { id, ...row } of rows) {
            if (id === undefined) continue;
            if (Object.keys(row).length === 0) continue;

            let query = trx(table).update(row).where({ id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
            updatedRows += await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });
    
            logger.info(`${request.method} ${request.originalUrl}: updated: ${id}`);
        }

        return updatedRows;
    });

    logger.info(`${request.method} ${request.originalUrl}: updated rows: ${updatedRows}`);

    return [200, { status: "ok" }];
});

export default putResource;