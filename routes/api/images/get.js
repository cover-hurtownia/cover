import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getImage = respond(async request => {
    const database = request.app.get("database");
    
    let {
        originalFilename,
        contentType,
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
    
    let query = database
        .select(["images.id", "images.content_type", "images.original_filename"])
        .from("images")

    if (originalFilename) query = query.andWhere("images.original_filename", "like", `%${originalFilename}%`);
    if (contentType) query = query.andWhere("images.content_type", "like", `%${contentType}%`);

    if (orderBy === "id") query = query.orderBy("images.id", ordering);
    else if (orderBy === "originalFilename") query = query.orderBy("images.original_filename", ordering);

    const [{ total = 0 } = { total: 0 }] = await query.clone().clear("group").countDistinct("images.id", { as: "total" });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const images = await query.offset(offset).limit(limit).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: images,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getImage;