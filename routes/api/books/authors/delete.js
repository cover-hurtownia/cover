import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";
import { respond } from "../../../utilities.js";

export const deleteBookAuthors = respond(async request => {
    const database = request.app.get("database");

    const book_id = request.params.book_id;

    const author_ids = Array.isArray(request.body) ? request.body : [request.body];

    if (author_ids.some(id => typeof id !== "number")) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

    await database.transaction(async trx => {
        for (const author_id of author_ids) {
            let query = trx("book_authors").delete().where({ book_id, author_id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
            await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
            });
        }
    });

    return [200, { status: "ok" }];
});

export default deleteBookAuthors;