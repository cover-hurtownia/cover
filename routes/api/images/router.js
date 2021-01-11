import express from "express";

export const router = express.Router();

import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

router.post("", async (request, response) => {
    const database = request.app.get("database");

    try {
        if (!request.files || !request.files.image) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

        const file = request.files.image;

        const query = database("images").insert({ data: file.data, type: file.mimetype, original_filename: file.name });

        logger.debug(`${request.originalUrl}: inserting image: ${file.data.length} bytes`);

        const [id] = await query.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        logger.debug(`${request.originalUrl}: image inserted with id: ${id}`);

        response.status(200);
        response.send({
            status: "ok",
            id
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
});

