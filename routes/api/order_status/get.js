import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";
import { respond } from "../../utilities.js";

export const getOrderStatus = respond(async request => {
    const database = request.app.get("database");
    
    let query = database("order_status");

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const order_status = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, errorCodes.DATABASE_ERROR, { debug: error }];
    });

    return [200, {
        status: "ok",
        data: order_status
    }];
});

export default getOrderStatus;