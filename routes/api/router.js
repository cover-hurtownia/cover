import express from "express";

import { login } from "./login.js";
import { register } from "./register.js";
import { logout } from "./logout.js";
import { session } from "./session.js";
import { roles } from "./roles.js";
import { echo } from "./echo.js";

import { router as productsRouter } from "./products/router.js";
import { router as authorsRouter } from "./authors/router.js";
import { router as publishersRouter } from "./publishers/router.js";
import { router as bindingTypesRouter } from "./binding_types/router.js";
import { router as booksRouter } from "./books/router.js";
import { router as imagesRouter } from "./images/router.js";
import { router as tagsRouter } from "./tags/router.js";
import { router as ordersRouter } from "./orders/router.js";
import { router as deliveryTypesRouter } from "./delivery_types/router.js";
import { router as orderStatusRouter } from "./order_status/router.js";

export const router = express.Router();

router.post("/echo"    , echo    );

router.post("/login"   , login   );
router.post("/register", register);
router.post("/logout"  , logout  );
router.post("/session" , session );
router.post("/roles"   , roles   );
router.post("/echo"    , echo    );

router.use("/products",       productsRouter     );
router.use("/authors",        authorsRouter      );
router.use("/publishers",     publishersRouter   );
router.use("/binding_types",  bindingTypesRouter );
router.use("/books",          booksRouter        );
router.use("/images",         imagesRouter       );
router.use("/tags",           tagsRouter         );
router.use("/orders",         ordersRouter       );
router.use("/delivery_types", deliveryTypesRouter);
router.use("/order_status",   orderStatusRouter  );