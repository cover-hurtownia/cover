import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getProduct = respond(async request => {
    const database = request.app.get("database");
    
    let {
        id,
        quantity,
        quantityAtLeast,
        quantityAtMost,
        price,
        priceAtLeast,
        priceAtMost,
        name,
        description,
        isPurchasable,
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
    
    let query = database("products")
        .select("products.*")
        .count("order_products.product_id", { as: "orders" })
        .leftJoin("order_products", "order_products.product_id", "products.id")
        .groupBy("products.id");

    if (id) {
        if (Array.isArray(id)) query = query.whereIn("id", id);
        else query = query.andWhere("id", "=", id);
    }

    if (quantity) query = query.andWhere("quantity_available", "=", quantity);
    if (quantityAtLeast) query = query.andWhere("quantity_available", ">=", quantityAtLeast);
    if (quantityAtMost) query = query.andWhere("quantity_available", "<=", quantityAtMost);

    if (price) query = query.andWhere("price", "=", price);
    if (priceAtLeast) query = query.andWhere("price", ">=", priceAtLeast);
    if (priceAtMost) query = query.andWhere("price", "<=", priceAtMost);

    if (name) query = query.andWhere("name", "like", `%${name}%`);
    if (description) query = query.andWhere("description", "like", `%${description}%`);

    if (isPurchasable) query = query.andWhere("is_purchasable", "=", Number(Boolean(isPurchasable)));

    if (orderBy === "id") query = query.orderBy("books.id", ordering);
    else if (orderBy === "quantity") query = query.orderBy("products.quantity_available", ordering);
    else if (orderBy === "name") query = query.orderBy("products.title", ordering);
    else if (orderBy === "price") query = query.orderBy("products.price", ordering);
    else if (orderBy === "orders") query = query.orderBy("orders", ordering);

    const total = (await query.clone()).length;

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