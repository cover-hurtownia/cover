import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getImageById = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const image_id = request.params.image_id;
        
        let query = database
            .select(["images.id", "images.type", "images.original_filename"])
            .from("images")
            .where({ id: image_id });

        logger.debug(`${request.originalUrl}: SQL: ${query.toString()}`);

        const images = await query.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (images.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

        const image = images[0];

        response.status(200);
        response.send({
            status: "ok",
            data: image
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

export default getImageById;