import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getPublisher = respond(async request => {
    const database = request.app.get("database");
    
    let {
        publisher,
        orderBy,
        ordering = "desc",
        limit = 20,
        offset = 0,
    } = request.query;

    ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;

    const [{ total }] = await database("publishers").count("id", { as: "total" });

    let query = database("publishers").offset(Math.max(offset, 0)).limit(Math.min(limit, 50));


    if (publisher) query = query.andWhere("publisher", "like", `%${publisher}%`);

    if (orderBy === "id") query = query.orderBy("id", ordering);
    else if (orderBy === "publisher") query = query.orderBy("publisher", ordering);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)

    const publishers = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: publishers,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getPublisher;