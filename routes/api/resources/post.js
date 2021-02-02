import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const postResource = table => respond(async request => {
    const database = request.app.get("database");
    
    const rows = Array.isArray(request.body) ? request.body : [request.body];

    for (let i = 0; i < rows.length; ++i) {
        const row = rows[i];

        if (!(row instanceof Object)) throw [400, {
            userMessage: "błąd formularza",
            devMessage: `data at index ${i} is not an object`
        }];
    } 

    const ids = await database.transaction(async trx => {
        const ids = [];

        for (const row of rows) {
            let query = trx(table).insert(row);

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);
    
            const [id] = await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
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