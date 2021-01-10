import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const deleteResource = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const ids = Array.isArray(request.body) ? request.body : [request.body];

        const query = database(table).delete().whereIn("id", ids);

        logger.debug(`${request.originalUrl}: SQL: ${query.toString()}`)

        const deletedRows = await query.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        logger.info(`${request.originalUrl}: deleted rows: ${deletedRows}`);

        response.status(200);
        response.send({
            status: "ok",
            rows: deletedRows
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

export default deleteResource;