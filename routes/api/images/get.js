import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getImage = respond(async request => {
    const database = request.app.get("database");
    
    let {
        filename,
        orderBy,
        ordering = "desc",
        limit = 20,
        offset = 0,
    } = request.query;

    ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;

    const [{ total }] = await database("images").count("id", { as: "total" });
    
    let query = database
        .select(["images.id", "images.type", "images.original_filename"])
        .from("images")
        .offset(Math.max(offset, 0))
        .limit(Math.min(limit, 50));

    if (filename) query = query.andWhere("images.original_filename", "like", `%${filename}%`);

    if (orderBy === "id") query = query.orderBy("images.id", ordering);
    else if (orderBy === "filename") query = query.orderBy("images.original_filename", ordering);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const images = await query.catch(error => {
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