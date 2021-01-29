import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const deleteResource = table => respond(async request => {
    const database = request.app.get("database");

    const ids = Array.isArray(request.body) ? request.body : [request.body];

    for (let i = 0; i < ids.length; ++i) {
        const id = ids[i];

        if (typeof id !== "number") throw [400, {
            userMessage: `błąd formularza`,
            devMessage: `resource id at index ${i} is not a number`
        }]; 
    } 

    await database.transaction(async trx => {
        const resources = await trx(table).whereIn("id", ids).catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        for (const id of ids) {
            let ok = false;

            for (const resource of resources) {
                if (resource.id === id) {
                    ok = true;
                    break;
                }
            }

            if (!ok) throw [404, {
                userMessage: `zasób o id ${id} nie istnieje`,
                devMessage: `resource with id ${id} doesn't exist`
            }];

            let query = trx(table).delete().where({ id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
            await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });
        }
    })

    return [200, { status: "ok" }];
});

export default deleteResource;