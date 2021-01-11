import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const deleteResource = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const ids = Array.isArray(request.body) ? request.body : [request.body];

        console.log(ids);
        if (ids.some(id => typeof id !== "number")) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

        const query = database(table).delete().whereIn("id", ids);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

        const deletedRows = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        logger.info(`${request.method} ${request.originalUrl}: deleted rows: ${deletedRows}`);

        response.status(200);
        response.send({
            status: "ok",
            rows: deletedRows
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

export default deleteResource;