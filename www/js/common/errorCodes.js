// General errors
// Server encountered a database error
export const DATABASE_ERROR = 0x01;

// Server encountered an internal error
export const INTERNAL_ERROR = 0x02;

// Authentication required
export const NOT_AUTHENTICATED = 0x03;

// Not authorized
export const NOT_AUTHORIZED = 0x04;



// /api/login
export const LOGIN_INVALID_USERNAME_OR_PASSWORD = 0x04;

// /api/register
export const REGISTER_USERNAME_INVALID_CHARACTERS = 0x05;
export const REGISTER_USERNAME_TOO_SHORT = 0x06;
export const REGISTER_PASSWORD_EMPTY = 0x07;
export const REGISTER_USERNAME_EXISTS = 0x08;



export const asMessage = status => ({
    [DATABASE_ERROR]: "database error",
    [INTERNAL_ERROR]: "internal error",
    [NOT_AUTHENTICATED]: "not authenticated",
    [NOT_AUTHORIZED]: "not authorized",
    [LOGIN_INVALID_USERNAME_OR_PASSWORD]: "invalid username or password",
    [REGISTER_USERNAME_INVALID_CHARACTERS]: "username contains invalid characters",
    [REGISTER_USERNAME_TOO_SHORT]: "username is too short",
    [REGISTER_PASSWORD_EMPTY]: "password can't be empty",
    [REGISTER_USERNAME_EXISTS]: "username already exists"
})[status] ?? "unknown error";