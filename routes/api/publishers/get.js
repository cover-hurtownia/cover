import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getPublisher = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let {
            publisher,
            orderBy,
            ordering = "desc",
            limit = 20,
            offset = 0,
        } = request.query;

        ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;

        const [{ total }] = await database("publishers").count("id", { as: "total" });

        let query = database("publishers").offset(Math.max(offset, 0)).limit(Math.min(limit, 50));


        if (publisher) query = query.andWhere("publisher", "like", `%${publisher}%`);

        if (orderBy === "id") query = query.orderBy("id", ordering);
        else if (orderBy === "publisher") query = query.orderBy("publisher", ordering);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

        const publishers = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: publishers,
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

export default getPublisher;