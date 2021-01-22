import logger from "../../../../logger.js";
import * as errorCodes from "../../../../www/js/common/errorCodes.js";
import { respond } from "../../../utilities.js";

export const getBookTags = respond(async request => {
    const database = request.app.get("database");

    const book_id = request.params.book_id;

    let query = database
        .select(["tags.id", "tags.tag"])
        .from("book_tags")
        .where("book_tags.book_id", book_id)
        .innerJoin("tags", "tags.id", "book_tags.tag_id");

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const tags = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    return [200, {
        status: "ok",
        data: tags
    }];
});

export default getBookTags;