export const up = async db => {
    await db.transaction(async db => {
        await db.schema.createTable("sessions", table => {
            table.string("sid");
            table.json("sess").notNullable();
            table.datetime("expired").notNullable();

            table.primary("sid", );
            table.index("expired", "sessions_expired_index");
        });

        await db.schema.createTable("users", table => {
            table.increments("id").primary();
            table.string("username", 16).unique().notNullable();
            table.string("password_hash", 60).notNullable();
        });

        await db.schema.createTable("roles", table => {
            table.increments("id").primary();
            table.string("role", 16).unique().notNullable();
        });

        await db.schema.createTable("user_roles", table => {
            table.integer("user_id").unsigned().notNullable();
            table.integer("role_id").unsigned().notNullable();

            table.foreign("user_id").references("id").inTable("users").onUpdate("CASCADE").onDelete("CASCADE");
            table.foreign("role_id").references("id").inTable("roles").onUpdate("CASCADE").onDelete("CASCADE");

            table.primary(["user_id", "role_id"]);
        });

        await db.schema.createTable("images", table => {
            table.increments("id").primary();
            table.string("original_filename");
            table.string("content_type").notNullable();
            table.specificType("binary_data", "MEDIUMBLOB").notNullable();
        });

        await db.schema.createTable("products", table => {
            table.increments("id").primary();
            table.string("name").notNullable();
            table.text("description");
            table.decimal("price", 13, 2).unsigned().notNullable();
            table.integer("quantity_available").unsigned().notNullable().defaultsTo(0);
            table.integer("quantity_on_hand").unsigned().notNullable().defaultsTo(0);
            table.boolean("is_purchasable").notNullable().defaultsTo(false);
            
            table.integer("image_id").unsigned();
            table.foreign("image_id").references("id").inTable("images").onUpdate("CASCADE").onDelete("SET NULL");
        });

        await db.schema.createTable("authors", table => {
            table.increments("id").primary();
            table.string("name").notNullable();
        });

        await db.schema.createTable("publishers", table => {
            table.increments("id").primary();
            table.string("name").notNullable();
        });

        await db.schema.createTable("book_formats", table => {
            table.increments("id").primary();
            table.string("format", 32).unique().notNullable();
        });

        await db.schema.createTable("tags", table => {
            table.increments("id").primary();
            table.string("tag", 32).unique().notNullable();
        });

        await db.schema.createTable("books", table => {
            table.increments("id").primary();
            table.string("title").notNullable();
            table.date("publication_date");
            table.string("isbn", 13);
            table.integer("pages").unsigned();

            table.integer("product_id").unsigned().notNullable();
            table.integer("publisher_id").unsigned().notNullable();
            table.integer("book_format_id").unsigned().notNullable();

            table.foreign("product_id").references("id").inTable("products");
            table.foreign("publisher_id").references("id").inTable("publishers");
            table.foreign("book_format_id").references("id").inTable("book_formats");
        });

        await db.schema.createTable("book_authors", table => {
            table.integer("author_id").unsigned().notNullable();
            table.integer("book_id").unsigned().notNullable();

            table.foreign("author_id").references("id").inTable("authors");
            table.foreign("book_id").references("id").inTable("books");
            
            table.primary(["author_id", "book_id"]);
        });

        await db.schema.createTable("book_tags", table => {
            table.integer("tag_id").unsigned().notNullable();
            table.integer("book_id").unsigned().notNullable();

            table.primary(["tag_id", "book_id"]);

            table.foreign("tag_id").references("id").inTable("tags");
            table.foreign("book_id").references("id").inTable("books");
        });

        await db.schema.createTable("delivery_types", table => {
            table.increments("id").primary();
            table.string("type", 32).unique().notNullable();
            table.decimal("price", 13, 2).unsigned().notNullable();
            table.string("tracking_url");
        });

        await db.schema.createTable("order_status", table => {
            table.increments("id").primary();
            table.string("status", 32).unique().notNullable();
        });

        await db.schema.createTable("orders", table => {
            table.increments("id").primary();
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("phone_number").notNullable();
            table.string("email");

            table.string("address").notNullable();
            table.string("apartment");
            table.string("city").notNullable();
            table.string("postal_code").notNullable();

            table.text("comment");
            
            table.datetime("order_date").notNullable();
            table.decimal("delivery_cost", 13, 2).unsigned().notNullable();
            table.string("tracking_number");

            table.integer("user_id").unsigned();
            table.integer("order_status_id").unsigned().notNullable();
            table.integer("delivery_type_id").unsigned().notNullable();

            table.foreign("user_id").references("id").inTable("users").onUpdate("CASCADE").onDelete("SET NULL");
            table.foreign("order_status_id").references("id").inTable("order_status")
            table.foreign("delivery_type_id").references("id").inTable("delivery_types");
        });

        await db.schema.createTable("order_products", table => {
            table.integer("order_id").unsigned().notNullable();
            table.integer("product_id").unsigned().notNullable();

            table.primary(["order_id", "product_id"]);

            table.integer("quantity_ordered").unsigned().notNullable();
            table.decimal("price_per_unit", 13, 2).unsigned().notNullable();

            table.foreign("order_id").references("id").inTable("orders").onUpdate("CASCADE").onDelete("CASCADE");
            table.foreign("product_id").references("id").inTable("products");
        });
    });
};

export const down = async db => {
    await db.transaction(async db => {
        await db.schema.dropTable("order_products");
        await db.schema.dropTable("orders");
        await db.schema.dropTable("order_status");
        await db.schema.dropTable("delivery_types");
        await db.schema.dropTable("book_tags");
        await db.schema.dropTable("book_authors");
        await db.schema.dropTable("books");
        await db.schema.dropTable("tags");
        await db.schema.dropTable("book_formats");
        await db.schema.dropTable("publishers");
        await db.schema.dropTable("authors");
        await db.schema.dropTable("products");
        await db.schema.dropTable("images");
        await db.schema.dropTable("user_roles");
        await db.schema.dropTable("roles");
        await db.schema.dropTable("users");
        await db.schema.dropTable("sessions");
    });
};