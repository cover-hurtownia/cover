import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const putResource = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const rows = Array.isArray(request.body) ? request.body : [request.body];

        if (rows.some(row => !(row instanceof Object) || row.id === undefined)) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

        const updatedRows = await database.transaction(async trx => {
            let updatedRows = 0;

            for (const { id, ...row } of rows) {
                if (id === undefined) continue;
                if (Object.keys(row).length === 0) continue;

                let query = trx(table).update(row).where({ id });

                logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
        
                updatedRows += await query.catch(error => {
                    logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                    throw [503, errorCodes.DATABASE_ERROR];
                });
        
                logger.info(`${request.method} ${request.originalUrl}: updated: ${id}`);
            }

            return updatedRows;
        });

        logger.info(`${request.method} ${request.originalUrl}: updated rows: ${updatedRows}`);

        response.status(200);
        response.send({
            status: "ok",
            rows: updatedRows
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

export default putResource;