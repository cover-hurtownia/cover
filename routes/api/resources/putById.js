import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const putResourceById = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.id;

        if (id === undefined) throw [400, errorCodes.UNKNOWN_ERROR];

        let updateResourceQuery = database(table).update(request.body).where({ id });

        logger.debug(`${request.originalUrl}: SQL: ${updateResourceQuery.toString()}`)

        const updatedRows = await updateResourceQuery.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${updateResourceQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (updatedRows === 0) throw [404, errorCodes.UNKNOWN_ERROR];

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

export default putResourceById;