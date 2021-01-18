import logger from "../../../logger.js";
import { respond } from "../../utilities.js";

export const getOrderById = respond(async request => {
    const database = request.app.get("database");
    
    const id = request.params.order_id;

    const { order, products } = await database.transaction(async trx => {
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
            .where("orders.id", id)
            .innerJoin("delivery_types", "orders.delivery_type_id", "delivery_types.id")
            .innerJoin("order_status", "orders.order_status_id", "order_status.id")
            .leftJoin("order_products", "orders.id", "order_products.order_id")
            .leftJoin("users", "orders.user_id", "users.id")
            .groupBy("orders.id");

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const orders = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (orders.length === 0) throw [404, `zamówienie o id ${id} nie istnieje`];

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
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        return { order, products };
    });

    return [200, {
        status: "ok",
        data: {
            ...order,
            products
        }
    }];
});

export default getOrderById;