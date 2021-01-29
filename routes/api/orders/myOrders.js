import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getMyOrders = respond(async request => {
    const database = request.app.get("database");
    
    let {
        id,
        orderDate,
        orderDateFirst,
        orderDateLast,
        deliveryType,
        status,
        totalCost,
        totalCostAtLeast,
        totalCostAtMost,
        trackingNumber,
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
            "order_status.status as order_status",
            "users.username",
            database.raw("SUM(order_products.price_per_unit * order_products.quantity_ordered) + delivery_types.price as total_cost")
        ])
        .from("orders")
        .innerJoin("delivery_types", "orders.delivery_type_id", "delivery_types.id")
        .innerJoin("order_status", "orders.order_status_id", "order_status.id")
        .leftJoin("order_products", "orders.id", "order_products.order_id")
        .leftJoin("users", "orders.user_id", "users.id")
        .groupBy("orders.id")
        .where("orders.user_id", request.session.user.id);

    if (id) {
        if (Array.isArray(id)) query = query.whereIn("orders.id", id);
        else query = query.andWhere("orders.id", "=", id);
    }
    if (orderDate) query = query.andWhere("orders.order_date", "=", orderDate);
    if (orderDateFirst) query = query.andWhere("orders.order_date", ">=", orderDateFirst);
    if (orderDateLast) query = query.andWhere("orders.order_date", "<=", orderDateLast);

    if (totalCost) query = query.having("total_cost", "=", totalCost);
    if (totalCostAtLeast) query = query.having("total_cost", ">=", totalCostAtLeast);
    if (totalCostAtMost) query = query.having("total_cost", "<=", totalCostAtMost);

    if (trackingNumber) query = query.andWhere("orders.tracking_number", "=", trackingNumber);

    if (deliveryType) {
        if (Array.isArray(deliveryType)) query = query.whereIn("delivery_types.type", deliveryType);
        else query = query.andWhere("delivery_types.type", "=", deliveryType);
    }
    if (status) {
        if (Array.isArray(status)) query = query.whereIn("order_status.status", status);
        else query = query.andWhere("order_status.status", "=", status);
    }

    if (orderBy === "id") query = query.orderBy("orders.id", ordering);
    else if (orderBy === "orderDate") query = query.orderBy("orders.order_date", ordering);
    else if (orderBy === "totalCost") query = query.orderBy("total_cost", ordering);

    const total = (await query.clone()).length;

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
                "order_products.order_id", "order_products.quantity_ordered", "order_products.price_per_unit"
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

export default getMyOrders;