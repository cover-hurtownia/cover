import bcrypt from "bcryptjs";

export const seed = async db => {
  await db.transaction(async db => {
    await db("order_products").delete();
    await db("orders").delete();
    await db("order_status").delete();
    await db("delivery_types").delete();
    await db("book_tags").delete();
    await db("book_authors").delete();
    await db("books").delete();
    await db("tags").delete();
    await db("book_formats").delete();
    await db("publishers").delete();
    await db("authors").delete();
    await db("products").delete();
    await db("images").delete();
    await db("user_roles").delete();
    await db("roles").delete();
    await db("users").delete();
    await db("sessions").delete();

    const [admin_user_id] = await db("users").insert({ username: "admin", password_hash: await bcrypt.hash("admin", await bcrypt.genSalt()) });
    const [user_user_id] = await db("users").insert({ username: "user", password_hash: await bcrypt.hash("password", await bcrypt.genSalt()) });
    const [admin_role_id] = await db("roles").insert({ role: "admin" });
    await db("user_roles").insert({ user_id: admin_user_id, role_id: admin_role_id });    

    const [fantasy_tag_id] = await db("tags").insert({ tag: "fantasy" });
    const [horror_tag_id] = await db("tags").insert({ tag: "horror" });
    const [scifi_tag_id] = await db("tags").insert({ tag: "sciencefiction" });
    const [computerscience_tag_id] = await db("tags").insert({ tag: "computerscience" });

    const [hardback_format_id] = await db("book_formats").insert({ format: "hardcover" });
    const [paperback_format_id] = await db("book_formats").insert({ format: "paperback" });

    const [placed_status_id] = await db("order_status").insert({ status: "placed" });
    const [accepted_status_id] = await db("order_status").insert({ status: "accepted" });
    const [sent_status_id] = await db("order_status").insert({ status: "sent" });
    const [delivered_status_id] = await db("order_status").insert({ status: "delivered" });
    const [cancelled_status_id] = await db("order_status").insert({ status: "cancelled" });

    const [couter_delivery_id] = await db("delivery_types").insert({ type: "courier", price: "15.00" });
    const [messengerpigeon_delivery_id] = await db("delivery_types").insert({ type: "messengerpigeon", price: "5.00" });
    const [personalpickup_delivery_id] = await db("delivery_types").insert({ type: "personalpickup", price: "0.00" });
  });
};