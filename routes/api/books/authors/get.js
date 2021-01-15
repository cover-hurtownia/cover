import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";
import { respond } from "../../../utilities.js";

export const getBookAuthors = respond(async request => {
    const database = request.app.get("database");
    
    const book_id = request.params.book_id;

    let query = database
        .select(["authors.id", "authors.author"])
        .from("book_authors")
        .where("book_authors.book_id", book_id)
        .innerJoin("authors", "authors.id", "book_authors.author_id");

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const authors = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    return [200, {
        status: "ok",
        data: authors
    }];
});

export default getBookAuthors;