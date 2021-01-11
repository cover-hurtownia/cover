import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getAuthor = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let {
            author,
            orderBy,
            ordering = "desc",
            limit = 20,
            offset = 0,
        } = request.query;

        ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;
        
        const [{ total }] = await database("authors").count("id", { as: "total" });

        let query = database("authors").offset(Math.min(offset, 0)).limit(Math.min(limit, 50));

        if (author) query = query.andWhere("author", "like", `%${author}%`);
        
        if (orderBy === "id") query = query.orderBy("id", ordering);
        else if (orderBy === "author") query = query.orderBy("author", ordering);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const authors = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: authors,
            total,
            limit,
            offset,
            orderBy,
            ordering
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

export default getAuthor;