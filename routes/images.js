import express from "express";

import logger from "../logger.js";

export const router = express.Router();

router.get("/:image_id", async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const image_id = request.params.image_id;

        let query = database("images").where({ id: image_id });
        
        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

        const images = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (images.length === 0) throw [404, { userMessage: `nie znaleziono zasobu`, devMessage: `image with id ${image_id} doesn't exist`}];

        const image = images[0];

        response.status(200);
        response.header("Content-Type", image.content_type);
        response.end(image.binary_data, "binary");
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`${request.method} ${request.originalUrl}: ${error.toString()}`);

            response.status(500);
            response.send({
                status: "error",
                error: {
                    userMessage: "błąd serwera",
                    devMessage: error.toString()
                }
            });
        }
        else {
            const [status, errorBody] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${JSON.stringify(errorBody)}`);

            const body = {
                status: "error",
                error: errorBody
            };

            response.status(status);
            response.send(body);
        }
    }
});