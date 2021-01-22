import { authenticated } from "../utilities.js";
import { respond } from "../utilities.js";

export const session = [authenticated, respond(async _ => {    
    return [200, {
        status: "ok",
        user: { username: request.session.user.username }
    }];
})];