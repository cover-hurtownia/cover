export const up = async db => {
    await db.schema.createTable('users', table => {
        table.increments('id').primary();

        table.string('username', 16).unique().notNullable();
        table.string('password_hash', 60).notNullable();
    });
};

export const down = async db => {
    await db.schema.dropTable("users");
};