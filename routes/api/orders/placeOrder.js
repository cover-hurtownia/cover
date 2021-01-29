import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const placeOrder = respond(async request => {
    const database = request.app.get("database");
    
    const order = request.body;

    if (!(order instanceof Object)) throw [400, {
        userMessage: "błąd formularza",
        devMessage: "request body is not an object"
    }];

    if (typeof order.first_name !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "first_name is not a string"
    }];
    if (order.first_name.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać imię",
        devMessage: "first_name is empty"
    }];



    if (typeof order.last_name !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "last_name is not a string"
    }];
    if (order.last_name.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać nazwisko",
        devMessage: "last_name is empty"
    }];

    if (typeof order.phone_number !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "phone_number is not a string"
    }];
    if (order.phone_number.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać numer telefonu",
        devMessage: "phone_number is empty"
    }];

    if (typeof order.email !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "email is not a string"
    }];
    if (order.email.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać email",
        devMessage: "email is empty"
    }];


    if (typeof order.address !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "address is not a string"
    }];
    if (order.address.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać ulicę",
        devMessage: "address is empty"
    }];

    if (order.apartment !== undefined && typeof order.apartment !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "apartment is not a string"
    }];

    if (typeof order.city !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "city is not a string"
    }];
    if (order.city.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać miasto",
        devMessage: "city is empty"
    }];

    if (typeof order.postal_code !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "postal_code is empty"
    }];
    if (order.postal_code.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać kod pocztowy",
        devMessage: "postal_code is empty"
    }];

    if (typeof order.delivery_type_id !== "number") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "delivery_type_id is not a number"
    }];

    if (!(order.products instanceof Array)) throw [400, {
        userMessage: "błąd formularza",
        devMessage: "products is not an array"
    }];
    if (order.products.length === 0) throw [400, {
        userMessage: "zamówienie musi zawierać co najmniej 1 produkt",
        devMessage: "products is empty"
    }];

    if (order.comment !== undefined && typeof order.comment !== "string") throw [400, {
        userMessage: "błąd formularza",
        devMessage: "comment is not a string"
    }];

    for (let i = 0; i < order.products.length; ++i) {
        const product = order.products[i];

        if (!(product instanceof Object)) throw [400, {
            userMessage: "błąd formularza",
            devMessage: `products[${i}] is not an object`
        }];
        if (typeof product.id !== "number") throw [400, {
            userMessage: "błąd formularza",
            devMessage: `products[${i}].id is not a number`
        }];
        if (typeof product.quantity !== "number") throw [400, {
            userMessage: "błąd formularza",
            devMessage: `products[${i}].quantity is not a number`
        }];
        if (product.quantity <= 0) throw [400, {
            userMessage: "błąd formularza",
            devMessage: `products[${i}].quantity is less than 1`
        }];
    }

    const id = await database.transaction(async trx => {
        const deliveryTypes = await trx("delivery_types").where({ id: order.delivery_type_id });

        if (deliveryTypes.length === 0) {
            throw [400, {
                userMessage: `wybrana metoda wysyłki nie jest dostępna`,
                devMessage: `delivery type with id ${order.delivery_type_id} doesn't exist`
            }];
        }

        const delivery_type = deliveryTypes[0];

        const orderStatus = await trx("order_status").where({ status: "placed" });

        if (orderStatus.length === 0) {
            throw [500, {
                userMessage: `błąd serwera`,
                devMessage: `order status "placed" doesn't exist`
            }];
        }

        const statusPlaced = orderStatus[0];

        let query = trx("orders").insert({
            order_date: trx.fn.now(),
            order_status_id: statusPlaced.id,
            first_name: order.first_name,
            last_name: order.last_name,
            phone_number: order.phone_number,
            email: order.email,
            address: order.address,
            city: order.city,
            postal_code: order.postal_code,
            delivery_cost: delivery_type.price,
            delivery_type_id: order.delivery_type_id,
            comment: order.comment,
            user_id: request.session?.user?.id
        });

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const [id] = await query.catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        logger.info(`${request.method} ${request.originalUrl}: inserted: ${id}`);

        for (const product of order.products) {
            const dbProductsQuery = trx("products").where({ id: product.id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${dbProductsQuery.toString()}`);

            const dbProducts = await dbProductsQuery.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });

            if (dbProducts.length === 0) {
                throw [404, {
                    userMessage: `produkt o id ${product.id} nie istnieje`,
                    devMessage: `product with id ${product.id} doesn't exist`
                }];
            }

            const dbProduct = dbProducts[0];

            if (!dbProduct.is_purchasable) {
                throw [400, {
                    userMessage: `produkt "${dbProduct.name}" nie jest dostępny na sprzedaż`,
                    devMessage: `product with id ${product.id} is not purchasable`
                }];
            }

            if (dbProduct.quantity_available < product.quantity) {
                throw [400, {
                    userMessage: `produkt "${dbProduct.name}" nie jest dostępny w podanej ilości sztuk. Dostępna ilość: ${dbProduct.quantity_available}, ilość w koszyku: ${product.quantity}`,
                    devMessage: `products with id ${product.id} available: ${dbProduct.quantity_available}, requested: ${product.quantity}`
                }];
            }

            let productQuery = trx("order_products").insert({
                order_id: id,
                product_id: product.id,
                quantity_ordered: product.quantity,
                price_per_unit: dbProduct.price
            });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${productQuery.toString()}`);

            await productQuery.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });

            let productUpdateQuery = trx("products").update({
                quantity_available: dbProduct.quantity_available - product.quantity,
            }).where({ id: product.id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${productUpdateQuery.toString()}`);

            await productUpdateQuery.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });
        }
        
        return id;
    });

    return [201, {
        status: "ok",
        id
    }];
});

export default placeOrder;