export const up = async db => {
    await db.schema.createTable('products', table => {
        table.increments('id').primary();
        table.integer("quantity").unsigned().notNullable();
        table.string('name').notNullable();
        table.text("description", "longtext");
    });

    await db.schema.createTable('authors', table => {
        table.increments('id').primary();
        table.string('author').unique().notNullable();
    });

    await db.schema.createTable('publishers', table => {
        table.increments('id').primary();
        table.string("publisher").unique().notNullable();
    });

    await db.schema.createTable('binding_types', table => {
        table.increments('id').primary();
        table.string("type").unique().notNullable();
    });

    await db.schema.createTable('books', table => {
        table.increments('id').primary();
        table.integer("product_id").unsigned().notNullable();
        
        table.integer("publisher_id").unsigned().notNullable();
        table.string("publication_date").notNullable();
        table.string("isbn").notNullable();
        table.integer("pages").unsigned().notNullable();
        table.integer("binding_type_id").unsigned().notNullable();
        table.binary("image");

        table.foreign("product_id").references("id").inTable("products").onDelete("CASCADE");
        table.foreign("publisher_id").references("id").inTable("publishers").onDelete("CASCADE");
        table.foreign("binding_type_id").references("id").inTable("binding_types").onDelete("CASCADE");
    });

    await db.schema.createTable("book_authors", table => {
        table.integer("book_id").unsigned().notNullable();
        table.integer("author_id").unsigned().notNullable();
        
        table.foreign("book_id").references("id").inTable("books").onDelete("CASCADE");
        table.foreign("author_id").references("id").inTable("authors").onDelete("CASCADE");

        table.primary(["book_id", "author_id"]);
    });
};

export const down = async db => {
    await db.schema.dropTable("products");
    await db.schema.dropTable("authors");
    await db.schema.dropTable("publishers");
    await db.schema.dropTable("binding_types");
    await db.schema.dropTable("books");
    await db.schema.dropTable("book_authors");
};