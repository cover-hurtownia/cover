import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const putResourceById = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.id;

        let query = database(table).update(request.body).where({ id });

        logger.debug(`${request.originalUrl}: SQL: ${query.toString()}`)

        const updatedRows = await query.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (updatedRows === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

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