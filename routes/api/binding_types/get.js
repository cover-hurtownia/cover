import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getBindingType = respond(async request => {
    const database = request.app.get("database");

    let query = database("binding_types");

    const { bindingType } = request.query;

    if (bindingType) query = query.andWhere("binding_type", "=", bindingType);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const binding_types = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, { status: "ok", data: binding_types }];
});

export default getBindingType;