export const up = async db => {
    await db.schema.createTable("order_status", table => {
        table.increments('id').primary();
        table.string("status").unique().notNullable();
    });

    await db.schema.createTable("delivery_types", table => {
        table.increments('id').primary();
        table.string("type").unique().notNullable();
        table.integer("price").unsigned().notNullable().defaultTo(0);
    });

    await db.schema.createTable("orders", table => {
        table.increments('id').primary();

        table.string('first_name').notNullable();
        table.string('last_name').notNullable();

        table.string('phone_number').notNullable();
        table.string('email');

        table.string('street').notNullable();
        table.string('city').notNullable();
        table.string('postal_code').notNullable();

        table.string('order_date').notNullable();

        table.string('tracking_number');
        
        table.integer("user_id").unsigned();
        table.integer('delivery_type_id').unsigned().notNullable();
        table.integer('order_status_id').unsigned().notNullable();

        table.foreign("user_id").references("id").inTable("users");
        table.foreign("delivery_type_id").references("id").inTable("delivery_types");
        table.foreign("order_status_id").references("id").inTable("order_status");
    });

    await db.schema.createTable("order_products", table => {
        table.increments('id').primary();

        table.integer("order_id").unsigned().notNullable();
        table.integer("product_id").unsigned().notNullable();
        table.integer("ordered_quantity").unsigned().notNullable();
        table.integer("price").unsigned().notNullable();

        table.integer('delivery_type_id').unsigned().notNullable();
        table.integer('order_status_id').unsigned().notNullable();

        table.foreign("delivery_type_id").references("id").inTable("delivery_types");
        table.foreign("order_status_id").references("id").inTable("order_status");
    });
};

export const down = async db => {
    await db.schema.dropTable("order_products");
    await db.schema.dropTable("orders");
    await db.schema.dropTable("delivery_types");
    await db.schema.dropTable("order_status");
};