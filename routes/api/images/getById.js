import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const getImageById = respond(async request => {
    const database = request.app.get("database");

    const image_id = request.params.image_id;
    
    let query = database
        .select(["images.id", "images.type", "images.original_filename"])
        .from("images")
        .where({ id: image_id });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const images = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    if (images.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

    const image = images[0];

    return [200, {
        status: "ok",
        data: image
    }];
});

export default getImageById;