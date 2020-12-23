export default {
    development: {
        client: 'sqlite3',
        connection: {
            filename: 'database.sqlite3'
        },
        useNullAsDefault: true,
        migrations: {
            extension: 'mjs',
            loadExtensions: ['.mjs']
        }
    },
    test: {
        client: 'sqlite3',
        connection: ":memory:",
        useNullAsDefault: true,
        migrations: {
            extension: 'mjs',
            loadExtensions: ['.mjs']
        }
    }
};