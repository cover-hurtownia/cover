import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getTag = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let query = database("tags");

        const { tag } = request.query;

        if (tag) query = query.andWhere("tag", "=", tag);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const tags = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: tags
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

export default getTag;