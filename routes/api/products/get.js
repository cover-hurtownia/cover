import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getProduct = respond(async request => {
    const database = request.app.get("database");
    
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
    
    let query = database("products");

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

    const [{ total = 0 } = { total: 0 }] = await query.clone().clear("group").countDistinct("products.id", { as: "total" });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const products = await query.offset(offset).limit(limit).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: products,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getProduct;