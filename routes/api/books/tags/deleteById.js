import logger from "../../../../logger.js";

import { respond } from "../../../utilities.js";

export const deleteBookTagById = respond(async request => {
    const database = request.app.get("database");

    const book_id = request.params.book_id;
    const author_id = request.params.author_id;

    await database.transaction(async trx => {
        let query = trx("book_tags").delete().where({ book_id, author_id });

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
        const deletedRows = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (deletedRows === 0) throw [404, {
            userMessage: `tag o id ${author_id} nie jest tagiem książki o id ${book_id}`,
            devMessage: `database entry with author_id ${author_id} and book_id ${book_id} not found`
        }];
    });

    return [200, { status: "ok" }];
});

export default deleteBookTagById;