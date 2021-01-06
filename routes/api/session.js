export const session = async (request, response) => {    
    try {
        if (request.session.hasOwnProperty("user")) {
            response.status(200);
            response.send({
                status: "ok",
                user: {
                    username: request.session.user.username
                }
            });
        }
        else throw "not logged in";
    }
    catch (error) {
        // Send 404 (bad request) on any error.
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
};