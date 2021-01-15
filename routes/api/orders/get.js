import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getOrder = async (request, response) => {
    const database = request.app.get("database");
    
    try {
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
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: orders,
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

export default getOrder;