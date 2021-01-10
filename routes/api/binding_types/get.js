import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getBindingType = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let query = database("binding_types");

        const { bindingType } = request.query;

        if (bindingType) query = query.andWhere("binding_type", "=", bindingType);

        logger.debug(`${request.originalUrl}: SQL: ${query.toString()}`)

        const binding_types = await query.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: binding_types
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

export default getBindingType;