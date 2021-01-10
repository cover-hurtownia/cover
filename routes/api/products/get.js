import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getProduct = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let productsQuery = database("products");

        const {
            quantity,
            quantityAtLeast,
            quantityAtMost,
            price,
            priceAtLeast,
            priceAtMost,
            name,
            description,
            available
        } = request.query;

        if (quantity) productsQuery = productsQuery.andWhere("quantity", "=", quantity);
        if (quantityAtLeast) productsQuery = productsQuery.andWhere("quantity", ">=", quantityAtLeast);
        if (quantityAtMost) productsQuery = productsQuery.andWhere("quantity", "<=", quantityAtMost);

        if (price) productsQuery = productsQuery.andWhere("price", "=", price);
        if (priceAtLeast) productsQuery = productsQuery.andWhere("price", ">=", priceAtLeast);
        if (priceAtMost) productsQuery = productsQuery.andWhere("price", "<=", priceAtMost);

        if (name) productsQuery = productsQuery.andWhere("name", "like", `%${name}%`);
        if (description) productsQuery = productsQuery.andWhere("description", "like", `%${description}%`);

        if (available) productsQuery = productsQuery.andWhere("available", "=", 1);

        logger.debug(`${request.originalUrl}: SQL: ${productsQuery.toString()}`)

        const products = await productsQuery.catch(error => {
            logger.error(`${request.originalUrl}: database error: ${productsQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: products
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

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

export default getProduct;