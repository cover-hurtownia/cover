export const up = async db => {
    await db.schema.createTable("sessions", table => {
        table.string("sid");
        table.json("sess").notNullable();
        table.datetime("expired").notNullable();

        table.primary("sid");
        table.index("expired", "sessions_expired_index");
    });
};

export const down = async db => {
    await db.schema.dropTable("sessions");
};