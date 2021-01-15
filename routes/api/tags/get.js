import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const getTag = respond(async request => {
    const database = request.app.get("database");
    
    let query = database("tags");

    const { tag } = request.query;

    if (tag) query = query.andWhere("tag", "=", tag);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const tags = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    return [200, {
        status: "ok",
        data: tags
    }];
});

export default getTag;