import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const postResource = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const rows = Array.isArray(request.body) ? request.body : [request.body];

        const ids = await database.transaction(async trx => {
            const ids = [];

            for (const row of rows) {
                let insertResourceQuery = trx(table).insert(row);

                logger.debug(`${request.originalUrl}: SQL: ${insertResourceQuery.toString()}`)
        
                const [id] = await insertResourceQuery.catch(error => {
                    logger.error(`${request.originalUrl}: database error: ${insertResourceQuery.toString()}: ${error}`);
                    throw [503, errorCodes.DATABASE_ERROR];
                });
        
                logger.info(`${request.originalUrl}: inserted: ${id}`);
                ids.push(id);
            }

            return ids;
        });

        logger.info(`${request.originalUrl}: inserted ids: ${ids.toString()}`);

        response.status(201);
        response.send({
            status: "ok",
            ids
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

export default postResource;