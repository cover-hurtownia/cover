import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const deleteResource = table => respond(async request => {
    const database = request.app.get("database");

    const ids = Array.isArray(request.body) ? request.body : [request.body];

    console.log(ids);
    if (ids.some(id => typeof id !== "number")) throw [400, errorCodes.RESOURCE_INVALID_REQUEST];

    const query = database(table).delete().whereIn("id", ids);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const deletedRows = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    logger.info(`${request.method} ${request.originalUrl}: deleted rows: ${deletedRows}`);

    return [200, {
        status: "ok",
        rows: deletedRows
    }];
});

export default deleteResource;