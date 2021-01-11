import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";

export const putBookTags = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const book_id = request.params.book_id;

        const tag_ids = Array.isArray(request.body) ? request.body : [request.body];

        if (tag_ids.some(id => typeof id !== Number)) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

        await database.transaction(async trx => {
            await trx("book_tags").delete().where({ book_id });

            for (const tag_id of tag_ids) {
                let query = trx("book_tags").insert({ book_id, tag_id });

                logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
        
                const [inserted_id] = await query.catch(error => {
                    logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                    throw [503, errorCodes.DATABASE_ERROR];
                });
        
                logger.info(`${request.method} ${request.originalUrl}: inserted: ${inserted_id}`);
            }
        });

        response.status(201);
        response.send({
            status: "ok"
        });
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
};

export default putBookTags;