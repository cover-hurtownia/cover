import bcrypt from "bcryptjs";

export const seed = async database => {
  await database.transaction(async trx => {
    await trx("users").delete();
    await trx("roles").delete();
    await trx("user_roles").delete();
    await trx("products").delete();
    await trx("authors").delete();
    await trx("publishers").delete();
    await trx("binding_types").delete();
    await trx("books").delete();
    await trx("book_authors").delete();

    const [admin] = await trx("users").insert({
      username: "admin",
      password_hash: await bcrypt.hash("admin", await bcrypt.genSalt())
    });
    const [roleAdmin] = await trx("roles").insert({ name: "ADMIN" });

    await trx("user_roles").insert({ user_id: admin, role_id: roleAdmin });

    const [user] = await trx("users").insert({
      username: "user",
      password_hash: await bcrypt.hash("password", await bcrypt.genSalt())
    });

    const [twardaOprawa] = await trx("binding_types").insert({ type: "twarda" });
    const [miekkaOprawa] = await trx("binding_types").insert({ type: "miękka" });

    const [lovecraft] = await trx("authors").insert({ author: "Howard Phillips Lovecraft" });
    const [tanabeGou] = await trx("authors").insert({ author: "Tanabe Gou" });
    const [stephenKing] = await trx("authors").insert({ author: "Stephen King" });
    const [jonDuckett] = await trx("authors").insert({ author: "Jon Duckett" });
    const [robertCMartin] = await trx("authors").insert({ author: "Robert C. Martin" });

    const [vesper] = await trx("publishers").insert({ publisher: "Vesper" });
    const [studioJG] = await trx("publishers").insert({ publisher: "Studio JG" });
    const [proszynski] = await trx("publishers").insert({ publisher: "Prószyński Media" });
    const [helion] = await trx("publishers").insert({ publisher: "Helion" });
    
    {
      const [product_id] = await trx("products").insert({
        quantity: 40,
        name: "ZGROZA W DUNWICH i inne przerażające opowieści",
        price: 6990,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: vesper,
        binding_type_id: twardaOprawa,
        publication_date: "2013-01-01",
        isbn: "9788377310984",
        pages: 800,
        title: "ZGROZA W DUNWICH i inne przerażające opowieści"
      });
    
      await trx("book_authors").insert({
        author_id: lovecraft,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 50,
        name: "ZGROZA W DUNWICH i inne przerażające opowieści",
        price: 5990,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: vesper,
        binding_type_id: twardaOprawa,
        publication_date: "2013-01-01",
        isbn: "9788377311578",
        pages: 792,
        title: "ZGROZA W DUNWICH i inne przerażające opowieści"
      });
    
      await trx("book_authors").insert({
        author_id: lovecraft,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 40,
        name: "H.P. Lovecraft: Kolor z innego wszechświata",
        price: 2990,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: studioJG,
        binding_type_id: miekkaOprawa,
        publication_date: "2017-01-01",
        isbn: "9788380012134",
        pages: 188,
        title: "H.P. Lovecraft: Kolor z innego wszechświata"
      });
    
      await trx("book_authors").insert({
        author_id: tanabeGou,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 40,
        name: "H.P. Lovecraft: OGAR i inne opowiadania",
        price: 2990,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: studioJG,
        binding_type_id: miekkaOprawa,
        publication_date: "2015-10-02",
        isbn: "9788380010895",
        pages: 172,
        title: "H.P. Lovecraft: OGAR i inne opowiadania"
      });
    
      await trx("book_authors").insert({
        author_id: tanabeGou,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 40,
        name: "Lśnienie",
        price: 3600,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: proszynski,
        binding_type_id: miekkaOprawa,
        publication_date: "2009-10-13",
        isbn: "9788376488097",
        pages: 520,
        title: "Lśnienie"
      });
    
      await trx("book_authors").insert({
        author_id: stephenKing,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 40,
        name: "Przebudzenie",
        price: 4200,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: proszynski,
        binding_type_id: miekkaOprawa,
        publication_date: "2014-01-01",
        isbn: "9788379610709",
        pages: 536,
        title: "Przebudzenie"
      });
    
      await trx("book_authors").insert({
        author_id: stephenKing,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 5,
        name: "JavaScript i jQuery. Interaktywne strony WWW dla każdego. Podręcznik Front-End Developera",
        price: 9900,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: helion,
        binding_type_id: miekkaOprawa,
        publication_date: "2015-04-27",
        isbn: "9788328344785",
        pages: 648,
        title: "JavaScript i jQuery. Interaktywne strony WWW dla każdego. Podręcznik Front-End Developera"
      });
    
      await trx("book_authors").insert({
        author_id: jonDuckett,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 5,
        name: "HTML i CSS. Zaprojektuj i zbuduj witrynę WWW. Podręcznik Front-End Developera",
        price: 9900,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: helion,
        binding_type_id: miekkaOprawa,
        publication_date: "2017-12-21",
        isbn: "9788328344785",
        pages: 512,
        title: "HTML i CSS. Zaprojektuj i zbuduj witrynę WWW. Podręcznik Front-End Developera"
      });
    
      await trx("book_authors").insert({
        author_id: jonDuckett,
        book_id
      });
    }

    {
      const [product_id] = await trx("products").insert({
        quantity: 5,
        name: "Czysty kod. Podręcznik dobrego programisty",
        price: 9900,
        available: true
      });

      const [book_id] = await trx("books").insert({
        product_id,
        publisher_id: helion,
        binding_type_id: miekkaOprawa,
        publication_date: "2010-02-19",
        isbn: "9788328302341",
        pages: 424,
        title: "Czysty kod. Podręcznik dobrego programisty"
      });
    
      await trx("book_authors").insert({
        author_id: robertCMartin,
        book_id
      });
    }
  });
};
