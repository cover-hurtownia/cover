import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getAuthor = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let authorsQuery = database("authors");

        const { author } = request.query;

        if (author) authorsQuery = authorsQuery.andWhere("author", "like", `%${author}%`);

        logger.debug(`${request.originalUrl}: SQL: ${authorsQuery.toString()}`)

        const authors = await authorsQuery.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${authorsQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: authors
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

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

export default getAuthor;