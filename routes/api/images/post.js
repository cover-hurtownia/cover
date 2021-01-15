import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const postImage = respond(async request => {
    const database = request.app.get("database");

    if (!request.files || !request.files.image) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

    const file = request.files.image;

    const query = database("images").insert({ data: file.data, type: file.mimetype, original_filename: file.name });

    logger.debug(`${request.method} ${request.originalUrl}: inserting image: ${file.data.length} bytes`);

    const [id] = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    logger.debug(`${request.method} ${request.originalUrl}: image inserted with id: ${id}`);

    return [200, {
        status: "ok",
        id
    }];
});

export default postImage;