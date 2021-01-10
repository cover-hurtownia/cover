import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getResourceById = table => async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.id;

        let ResourcesQuery = database(table).where({ id });

        logger.debug(`${request.originalUrl}: SQL: ${ResourcesQuery.toString()}`)

        const resources = await ResourcesQuery.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${ResourcesQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (resources.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

        const resource = resources[0];

        response.status(200);
        response.send({
            status: "ok",
            data: resource
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

export default getResourceById;