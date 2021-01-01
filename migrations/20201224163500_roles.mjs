export const up = async db => {
    await db.raw('PRAGMA foreign_keys = ON');

    await db.schema.createTable('roles', table => {
        table.increments('id').primary();
        table.string('name', 16).unique().notNullable();
    });

    await db.schema.createTable("user_roles", table => {
        table.integer("user_id").notNullable();
        table.integer("role_id").notNullable();
        
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.foreign("role_id").references("id").inTable("roles").onDelete("CASCADE");

        table.primary(["user_id", "role_id"]);
    });
};

export const down = async db => {
    await db.schema.dropTable("user_roles");
    await db.schema.dropTable("roles");
};