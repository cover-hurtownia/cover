import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getBindingType = respond(async request => {
    const database = request.app.get("database");

    let query = database("book_formats");

    const { bindingType } = request.query;

    if (bindingType) query = query.andWhere("book_format", "=", bindingType);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const book_formats = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, { status: "ok", data: book_formats }];
});

export default getBindingType;