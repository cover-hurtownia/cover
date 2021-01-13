import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getImage = async (request, response) => {
    const database = request.app.get("database");
    
    try {
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
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: images,
            total,
            limit,
            offset,
            orderBy,
            ordering
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

        response.status(status);
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
};

export default getImage;