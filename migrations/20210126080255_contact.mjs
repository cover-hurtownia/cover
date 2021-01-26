export const up = async db => {
    await db.transaction(async db => {
        await db.schema.createTable("contact_form_messages", table => {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.string("email").notNullable();
            table.text("message").notNullable();
        });
    });
};

export const down = async db => {
    await db.transaction(async db => {
        await db.schema.dropTable("contact_form_messages");
    });
};