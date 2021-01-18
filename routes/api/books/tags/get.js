import logger from "../../../../logger.js";

import { respond } from "../../../utilities.js";

export const getBookTags = respond(async request => {
    const database = request.app.get("database");
    
    const book_id = request.params.book_id;

    let query = database
        .select(["tags.id", "tags.tag"])
        .from("book_tags")
        .where("book_tags.book_id", book_id)
        .innerJoin("tags", "tags.id", "book_tags.author_id");

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const authors = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: authors
    }];
});

export default getBookTags;