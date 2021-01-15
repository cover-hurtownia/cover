import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const getDeliveryType = respond(async request => {
    const database = request.app.get("database");

    let query = database("delivery_types");
    
    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const delivery_types = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    return [200, {
        status: "ok",
        data: delivery_types
    }];
});

export default getDeliveryType;