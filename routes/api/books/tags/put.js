import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";

export const putBookTags = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const book_id = request.params.book_id;

        const tag_ids = request.body;

        await database.transaction(async trx => {
            await trx("book_tags").delete().where({ book_id });

            for (const tag_id of tag_ids) {
                let query = trx("book_tags").insert({ book_id, tag_id });

                logger.debug(`${request.originalUrl}: SQL: ${query.toString()}`)
        
                const [inserted_id] = await query.catch(error => {
                    logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                    throw [503, errorCodes.DATABASE_ERROR];
                });
        
                logger.info(`${request.originalUrl}: inserted: ${inserted_id}`);
            }
        });

        response.status(201);
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

export default putBookTags;