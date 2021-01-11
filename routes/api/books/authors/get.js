import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";

export const getBookAuthors = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const book_id = request.params.book_id;

        let query = database
            .select(["authors.id", "authors.author"])
            .from("book_authors")
            .where("book_authors.book_id", book_id)
            .innerJoin("authors", "authors.id", "book_authors.author_id");

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

        const authors = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: authors
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

        response.status(status);
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
};

export default getBookAuthors;