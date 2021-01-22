import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";
import { respond } from "../../../utilities.js";

export const deleteBookAuthorById = respond(async request => {
    const database = request.app.get("database");

    const book_id = request.params.book_id;
    const author_id = request.params.author_id;

    let query = database("book_authors").delete().where({ book_id, author_id });

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

export default deleteBookAuthorById;