import express from "express";

import logger from "../logger.js";
import * as errorCodes from "../www/js/common/errorCodes.js";

export const router = express.Router();

router.get("/:image_id", async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const image_id = request.params.image_id;

        let query = database("images").where({ id: image_id });
        
        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

        const images = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (images.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

        const image = images[0];

        response.status(200);
        response.header("Content-Type", image.type);
        response.end(image.data, "binary");
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

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