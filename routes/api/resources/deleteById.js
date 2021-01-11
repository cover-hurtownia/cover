import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const deleteResourceById = (table, param) => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params[param];

        let query = database(table).delete().where({ id });

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

        const deletedRows = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (deletedRows === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

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

export default deleteResourceById;