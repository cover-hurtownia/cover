import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const putImageById = async (request, response) => {
    const database = request.app.get("database");

    try {
        const image_id = request.params.image_id;

        if (!request.files || !request.files.image) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

        const file = request.files.image;

        const query = database("images").update({ data: file.data, type: file.mimetype, original_filename: file.name }).where({ id: image_id });

        logger.debug(`${request.originalUrl}: updating image: ${file.data.length} bytes`);

        await query.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok"
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

export default putImageById;