import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getOrder = respond(async request => {
    const database = request.app.get("database");
    
    let {
        id,
        firstName,
        lastName,
        phoneNumber,
        email,
        username,
        street,
        apartment,
        city,
        postalCode,
        orderDate,
        orderDateFirst,
        orderDateLast,
        trackingNumber,
        deliveryType,
        status,
        totalCost,
        totalCostAtLeast,
        totalCostAtMost,
        orderBy = "orderDate",
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
        .select([
            "orders.*",
            "delivery_types.type as delivery_type",
            "delivery_types.price as delivery_cost",
            "order_status.status as status",
            "users.username",
            database.raw("SUM(order_products.price * order_products.ordered_quantity) + delivery_types.price as total_cost")
        ])
        .from("orders")
        .innerJoin("delivery_types", "orders.delivery_type_id", "delivery_types.id")
        .innerJoin("order_status", "orders.order_status_id", "order_status.id")
        .leftJoin("order_products", "orders.id", "order_products.order_id")
        .leftJoin("users", "orders.user_id", "users.id")
        .groupBy("orders.id");

    if (id) query = query.andWhere("orders.id", "=", id);
    if (firstName) query = query.andWhere("orders.first_name", "like", `%${firstName}%`);
    if (lastName) query = query.andWhere("orders.last_name", "like", `%${lastName}%`);
    if (phoneNumber) query = query.andWhere("orders.phone_number", "like", `%${phoneNumber}%`);
    if (email) query = query.andWhere("orders.email", "like", `%${email}%`);
    if (username) query = query.andWhere("users.username", "like", `%${username}%`);
    if (street) query = query.andWhere("orders.street", "like", `%${street}%`);
    if (apartment) query = query.andWhere("orders.apartment", "like", `%${apartment}%`);
    if (city) query = query.andWhere("orders.city", "like", `%${city}%`);
    if (postalCode) query = query.andWhere("orders.postal_code", "like", `%${postalCode}%`);
    if (trackingNumber) query = query.andWhere("orders.tracking_number", "=", trackingNumber);
    if (orderDate) query = query.andWhere("orders.order_date", "=", orderDate);
    if (orderDateFirst) query = query.andWhere("orders.order_date", ">=", orderDateFirst);
    if (orderDateLast) query = query.andWhere("orders.order_date", "<=", orderDateLast);

    if (totalCost) query = query.having("total_cost", "=", totalCost);
    if (totalCostAtLeast) query = query.having("total_cost", ">=", totalCostAtLeast);
    if (totalCostAtMost) query = query.having("total_cost", "<=", totalCostAtMost);

    if (deliveryType) {
        if (Array.isArray(deliveryType)) query = query.whereIn("delivery_types.type", deliveryType);
        else query = query.andWhere("delivery_types.type", "=", deliveryType);
    }
    if (status) {
        if (Array.isArray(status)) query = query.whereIn("order_status.status", status);
        else query = query.andWhere("order_status.status", "=", status);
    }

    if (orderBy === "id") query = query.orderBy("orders.id", ordering);
    else if (orderBy === "firstName") query = query.orderBy("orders.first_name", ordering);
    else if (orderBy === "lastName") query = query.orderBy("orders.last_name", ordering);
    else if (orderBy === "orderDate") query = query.orderBy("orders.order_date", ordering);
    else if (orderBy === "totalCost") query = query.orderBy("total_cost", ordering);

    const [{ total = 0 } = { total: 0 }] = await query.clone().clear("group").countDistinct("orders.id", { as: "total" });

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const orders = await query
        .offset(offset)
        .limit(limit)
        .then(orders => orders.map(order => ({ ...order, products: [] })))
        .catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    let productsQuery = database
            .select([
                "products.id", "products.name", "products.description", "products.image_id",
                "order_products.order_id", "order_products.ordered_quantity", "order_products.price"
            ])
            .from("order_products")
            .whereIn("order_products.order_id", orders.map(order => order.id))
            .innerJoin("products", "products.id", "order_products.product_id");

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${productsQuery.toString()}`);

    const products = await productsQuery.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    for (const product of products) {
        for (const order of orders) {
            if (product.order_id === order.id) {
                order.products.push(product);
                break;
            }
        }
    }

    return [200, {
        status: "ok",
        data: orders,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getOrder;