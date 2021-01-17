import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getAuthor = respond(async request => {
    const database = request.app.get("database");

    let {
        author,
        orderBy,
        ordering = "desc",
        limit = 20,
        offset = 0,
    } = request.query;

    ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;
    
    const [{ total }] = await database("authors").count("id", { as: "total" });

    let query = database("authors").offset(Math.max(offset, 0)).limit(Math.min(limit, 50));

    if (author) query = query.andWhere("author", "like", `%${author}%`);
    
    if (orderBy === "id") query = query.orderBy("id", ordering);
    else if (orderBy === "author") query = query.orderBy("author", ordering);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const authors = await query.catch(error => {
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