export const up = async db => {
    await db.schema.alterTable('products', table => {
        table.integer("price").unsigned().notNullable().defaultTo(0);
        table.boolean("available").notNullable().defaultTo(false);
        table.binary("image");
    });

    const books = await db("books").select(["product_id", "image"]);

    await db.schema.alterTable('books', table => {
        table.dropColumn("image");
        table.text("title");
    });

    for (const { product_id, image } of books) {
        await db("products").update({ image }).where({ id: product_id });
    }
};

export const down = async db => {
    const products = await db("products")
        .select(["books.id", "products.image"])
        .join("books", "products.id", "books.product_id");

    await db.schema.alterTable('products', table => {
        table.dropColumn("price");
        table.dropColumn("available");
        table.dropColumn("image");
    });

    await db.schema.alterTable('books', table => {
        table.binary("image");
        table.dropColumn("title");
    });

    for (const { id, image } of products) {
        await db("books").update({ image }).where({ id });
    }
};