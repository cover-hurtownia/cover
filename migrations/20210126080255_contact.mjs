export const up = async db => {
    await db.transaction(async db => {
        await db.schema.createTable("client_messages", table => {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("email").notNullable();
            table.string("title");
            table.text("message").notNullable();
            table.datetime("date").notNullable();
            table.boolean("read").notNullable().defaultsTo(false);
        });
    });
};

export const down = async db => {
    await db.transaction(async db => {
        await db.schema.dropTable("client_messages");
    });
};