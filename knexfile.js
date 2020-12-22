export default {
    development: {
        client: 'sqlite3',
        connection: {
            filename: 'database.sqlite3'
        },
        useNullAsDefault: true
    },
    test: {
        client: 'sqlite3',
        connection: ":memory:",
        useNullAsDefault: true
    }
};