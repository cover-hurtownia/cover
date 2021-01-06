import express from "express";
import { login } from "./login.js";
import { register } from "./register.js";
import { logout } from "./logout.js";
import { session } from "./session.js";
import { roles } from "./roles.js";
import { echo } from "./echo.js";

export const router = express.Router();

router.post("/login"   , login   );
router.post("/register", register);
router.post("/logout"  , logout  );
router.post("/session" , session );
router.post("/roles"   , roles   );
router.post("/echo"    , echo    );