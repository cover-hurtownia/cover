import { authenticated } from "../utilities.js";

export const session = [authenticated, async (request, response) => {    
    response.status(200);
    response.send({
        status: "ok",
        user: {
            username: request.session.user.username
        }
    });
}];