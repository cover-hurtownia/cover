import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const deleteResourceById = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.id;

        let deleteResourceQuery = database(table).delete().where({ id });

        logger.debug(`${request.originalUrl}: SQL: ${deleteResourceQuery.toString()}`)

        const deletedRows = await deleteResourceQuery.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${deleteResourceQuery.toString()}: ${error}`);
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

export default deleteResourceById;