export const up = async db => {
    const products = await db("products")
        .select(["products.id", "products.image"]);

    await db.schema.createTable("images", table => {
        table.increments('id').primary();
        table.specificType("data", "MEDIUMBLOB").notNull();
        table.string("type").notNull();
        table.string("original_filename");
    });

    await db.schema.alterTable("products", table => {
        table.dropColumn("image");
        table.integer("image_id").unsigned();

        table.foreign("image_id").references("id").inTable("images").onDelete("SET NULL");
    });

    for (const { id, image } of products) {
        const [image_id] = await db("images").insert({ image });
        await db("products").update({ image_id }).where({ id });
    }
};

export const down = async db => {
    const images = await db("images")
        .select(["images.id", "images.data"]);

    const products = await db("products")
        .select(["products.id", "products.image_id"]);

    await db.schema.alterTable("products", table => {
        table.dropForeign("image_id");
        table.dropColumn("image_id");
        table.binary("image");
    });

    for (const { id: product_id, image_id } of products) {
        const image = images.find(({ id }) => id === image_id).data;

        if (image) db("products").update({ image }).where({ id: product_id });
    }

    await db.schema.dropTable("images");
};