import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getProduct = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let {
            quantity,
            quantityAtLeast,
            quantityAtMost,
            price,
            priceAtLeast,
            priceAtMost,
            name,
            description,
            available,
            orderBy,
            ordering = "desc",
            limit = 20,
            offset = 0,
        } = request.query;

        ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;

        const [{ total }] = await database("products").count("id", { as: "total" });
        
        let query = database("products").offset(Math.max(offset, 0)).limit(Math.min(limit, 50));

        if (quantity) query = query.andWhere("quantity", "=", quantity);
        if (quantityAtLeast) query = query.andWhere("quantity", ">=", quantityAtLeast);
        if (quantityAtMost) query = query.andWhere("quantity", "<=", quantityAtMost);

        if (price) query = query.andWhere("price", "=", price);
        if (priceAtLeast) query = query.andWhere("price", ">=", priceAtLeast);
        if (priceAtMost) query = query.andWhere("price", "<=", priceAtMost);

        if (name) query = query.andWhere("name", "like", `%${name}%`);
        if (description) query = query.andWhere("description", "like", `%${description}%`);

        if (available) query = query.andWhere("available", "=", 1);

        if (orderBy === "id") query = query.orderBy("books.id", ordering);
        else if (orderBy === "quantity") query = query.orderBy("products.quantity", ordering);
        else if (orderBy === "name") query = query.orderBy("products.title", ordering);
        else if (orderBy === "price") query = query.orderBy("products.price", ordering);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const products = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: products,
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

export default getProduct;