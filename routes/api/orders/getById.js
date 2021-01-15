import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getOrderById = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.order_id;

        let query = database
            .select([
                "orders.*",
                "delivery_types.type as delivery_type",
                "order_status.status as status",
                "users.username"
            ])
            .from("orders")
            .where("orders.id", id)
            .innerJoin("delivery_types", "orders.delivery_type_id", "delivery_types.id")
            .innerJoin("order_status", "orders.order_status_id", "order_status.id")
            .leftJoin("users", "orders.user_id", "users.id");

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const orders = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (orders.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

        const order = orders[0];

        let productsQuery = database
            .select([
                "products.id", "products.price", "products.name", "products.description", "products.image_id",
                "order_products.ordered_quantity", "order_products.price"
            ])
            .from("order_products")
            .where("order_products.order_id", id)
            .innerJoin("products", "products.id", "order_products.product_id");

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${productsQuery.toString()}`);

        const products = await productsQuery.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: {
                ...order,
                products
            }
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

export default getOrderById;