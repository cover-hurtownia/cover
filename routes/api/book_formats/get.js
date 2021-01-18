import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getBookFormat = respond(async request => {
    const database = request.app.get("database");

    let query = database("book_formats");

    const { bookFormat } = request.query;

    if (bookFormat) query = query.andWhere("book_format", "=", bookFormat);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const bookFormats = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, { status: "ok", data: bookFormats }];
});

export default getBookFormat;