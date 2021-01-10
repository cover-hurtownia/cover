import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getPublisher = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let publishersQuery = database("publishers");

        const { publisher } = request.query;

        if (publisher) publishersQuery = publishersQuery.andWhere("publisher", "like", `%${publisher}%`);

        logger.debug(`${request.originalUrl}: SQL: ${publishersQuery.toString()}`)

        const publishers = await publishersQuery.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${publishersQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: publishers
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

export default getPublisher;