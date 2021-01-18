import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getAuthor = respond(async request => {
    const database = request.app.get("database");

    let {
        name,
        orderBy,
        ordering = "desc",
        limit = 20,
        offset = 0,
    } = request.query;

    limit = Math.trunc(Math.max(1, Math.min(50, 
        typeof limit === "number"
            ? limit
            : typeof limit !== "string"
                ? 20
                : isNaN(Number(limit))
                    ? 20
                    : Number(limit)
    )));

    offset = Math.trunc(Math.max(0, 
        typeof offset === "number"
            ? offset
            : typeof offset !== "string"
                ? 0
                : isNaN(Number(offset))
                    ? 0
                    : Number(offset)
    ));

    ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;
    
    let query = database("authors");

    if (name) query = query.andWhere("name", "like", `%${name}%`);
    
    if (orderBy === "id") query = query.orderBy("id", ordering);
    else if (orderBy === "name") query = query.orderBy("name", ordering);

    const [{ total = 0 } = { total: 0 }] = await query.clone().clear("group").countDistinct("authors.id", { as: "total" });
    
    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const authors = await query.offset(offset).limit(limit).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: authors,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getAuthor;