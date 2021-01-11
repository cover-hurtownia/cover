export const up = async db => {
    await db.schema.createTable("tags", table => {
        table.increments('id').primary();
        table.string("tag").notNullable();
    });

    await db.schema.createTable("book_tags", table => {
        table.integer("book_id").unsigned().notNullable();
        table.integer("tag_id").unsigned().notNullable();
        
        table.foreign("book_id").references("id").inTable("books").onDelete("CASCADE");
        table.foreign("tag_id").references("id").inTable("tags").onDelete("CASCADE");

        table.primary(["book_id", "tag_id"]);
    });
};

export const down = async db => {
    await db.schema.dropTable("book_tags");
    await db.schema.dropTable("tags");
};