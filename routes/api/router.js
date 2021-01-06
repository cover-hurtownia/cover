import express from "express";

import { authenticated } from "../utilities.js";

import { login } from "./login.js";
import { register } from "./register.js";
import { logout } from "./logout.js";
import { session } from "./session.js";
import { roles } from "./roles.js";
import { echo } from "./echo.js";

export const router = express.Router();

router.post("/login"   , login   );
router.post("/register", register);
router.post("/logout"  , authenticated, logout );
router.post("/session" , authenticated, session);
router.post("/roles"   , authenticated, roles  );
router.post("/echo"    , echo    );