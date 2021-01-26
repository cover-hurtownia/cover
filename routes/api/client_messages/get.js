import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getMessage = respond(async request => {
    const database = request.app.get("database");
    
    let {
        id,
        name,
        email,
        title,
        read,
        date,
        dateFirst,
        dateLast,
        orderBy = "date",
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
    
    let query = database("client_messages");

    if (id) {
        if (Array.isArray(id)) query = query.whereIn("client_messages.id", id);
        else query = query.andWhere("client_messages.id", "=", id);
    }
    if (name) query = query.andWhere("client_messages.name", "like", `%${name}%`);
    if (email) query = query.andWhere("client_messages.email", "like", `%${email}%`);
    if (title) query = query.andWhere("client_messages.title", "like", `%${title}%`);
    if (read !== undefined) query = query.andWhere("client_messages.read", "=", read);
    if (date) query = query.andWhere("client_messages.date", "=", orderDate);
    if (dateFirst) query = query.andWhere("client_messages.date", ">=", orderDateFirst);
    if (dateLast) query = query.andWhere("client_messages.date", "<=", orderDateLast);

    if (orderBy === "id") query = query.orderBy("client_messages.id", ordering);
    else if (orderBy === "name") query = query.orderBy("client_messages.name", ordering);
    else if (orderBy === "date") query = query.orderBy("client_messages.date", ordering);

    const total = (await query.clone()).length;

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const messages = await query
        .offset(offset)
        .limit(limit)
        .catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: messages,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getMessage;