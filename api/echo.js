export const echo = db => async (request, response) => {
    response.send({
        message: "Hello from /api/echo.",
        data: request.body
    });
};