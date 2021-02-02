import logger from "../../../logger.js";
import { respond } from "../../utilities.js";

export const deliveredOrder = respond(async request => {
    const database = request.app.get("database");
    
    const id = request.params.order_id;

    await database.transaction(async trx => {
        const orderStatus = await trx("order_status").where({ status: "delivered" });

        if (orderStatus.length === 0) {
            throw [500, {
                userMessage: `błąd serwera`,
                devMessage: `order status "delivered" doesn't exist`
            }];
        }

        const statusDelivered = orderStatus[0];

        let query = trx("orders")
            .update({ order_status_id: statusDelivered.id })
            .where("orders.id", id);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });
    });

    return [200, { status: "ok" }];
});

export default deliveredOrder;