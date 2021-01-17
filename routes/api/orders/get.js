import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getOrder = respond(async request => {
    const database = request.app.get("database");
    
    let {
        firstName,
        lastName,
        phoneNumber,
        email,
        street,
        apartment,
        city,
        postalCode,
        orderDate,
        trackingNumber,
        deliveryType,
        orderStatus,
        orderBy,
        ordering = "desc",
        limit = 20,
        offset = 0,
    } = request.query;

    ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;

    const [{ total }] = await database("orders").count("id", { as: "total" });
    
    let query = database
        .select([
            "orders.*",
            "delivery_types.type as delivery_type",
            "order_status.status as status",
            "users.username"
        ])
        .from("orders")
        .innerJoin("delivery_types", "orders.delivery_type_id", "delivery_types.id")
        .innerJoin("order_status", "orders.order_status_id", "order_status.id")
        .leftJoin("users", "orders.user_id", "users.id")
        .offset(Math.max(offset, 0)).limit(Math.min(limit, 50));

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const orders = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

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