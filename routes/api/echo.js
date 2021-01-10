export const echo = async (request, response) => {
    logger.info(`${request.originalUrl}: got ${JSON.stringify(request.body)}`);

    response.send({
        message: "Hello from /api/echo.",
        data: request.body
    });
};