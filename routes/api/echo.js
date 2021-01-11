import logger from "../../logger.js";

export const echo = async (request, response) => {
    logger.info(`${request.method} ${request.originalUrl}: got ${JSON.stringify(request.body)}`);

    response.send({
        message: "Hello from /api/echo.",
        data: request.body
    });
};