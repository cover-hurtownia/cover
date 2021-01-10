import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const putResource = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const rows = Array.isArray(request.body) ? request.body : [request.body];

        const updatedRows = await database.transaction(async trx => {
            let updatedRows = 0;

            for (const { id, ...row } of rows) {
                if (id === undefined) continue;
                if (Object.keys(row).length === 0) continue;

                let updateResourceQuery = trx(table).update(row).where({ id });

                logger.debug(`${request.originalUrl}: SQL: ${updateResourceQuery.toString()}`)
        
                updatedRows += await updateResourceQuery.catch(error => {
                    logger.error(`${request.originalUrl}: database error: ${updateResourceQuery.toString()}: ${error}`);
                    throw [503, errorCodes.DATABASE_ERROR];
                });
        
                logger.info(`${request.originalUrl}: updated: ${id}`);
            }

            return updatedRows;
        });

        logger.info(`${request.originalUrl}: updated rows: ${updatedRows}`);

        response.status(200);
        response.send({
            status: "ok",
            rows: updatedRows
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

export default putResource;