import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const putImageById = respond(async request => {
    const database = request.app.get("database");

    const image_id = request.params.image_id;

    if (!request.files || !request.files.image) throw [400, {
        userMessage: "żądanie nie zawiera pliku",
        devMessage: "request doesn't contain any files"
    }];

    const file = request.files.image;

    const query = database("images").update({ data: file.data, type: file.mimetype, original_filename: file.name }).where({ id: image_id });

    logger.debug(`${request.method} ${request.originalUrl}: updating image: ${file.data.length} bytes`);

    await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, { status: "ok" }];
});

export default putImageById;