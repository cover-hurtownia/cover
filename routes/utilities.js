export const authenticated = async (request, response, next) => {
    if (request.session.hasOwnProperty("user")) next();
    else {
        response.status(400)
        response.send({
            status: "error",
            error: "not logged in"
        });
    }
};