import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const postImage = respond(async request => {
    const database = request.app.get("database");

    if (!request.files || !request.files.image) throw [400, {
        userMessage: "błąd przesyłania",
        devMessage: "request doesn't contain any files"
    }];

    const file = request.files.image;

    const query = database("images").insert({ data: file.data, content_type: file.mimetype, original_filename: file.name });

    logger.debug(`${request.method} ${request.originalUrl}: inserting image: ${file.data.length} bytes`);

    const [id] = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    logger.debug(`${request.method} ${request.originalUrl}: image inserted with id: ${id}`);

    return [200, {
        status: "ok",
        id
    }];
});

export default postImage;