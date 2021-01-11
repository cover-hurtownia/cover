import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getProduct from "./get.js";

export const router = express.Router();

router.get("", getProduct);
router.post("", adminAuthorization, resources.post("products"));
router.put("", adminAuthorization, resources.put("products"));
router.delete("", adminAuthorization, resources.delete("products"));

router.get("/:id", resources.getById("products"));
router.put("/:id", adminAuthorization, resources.putById("products"));
router.delete("/:id", adminAuthorization, resources.deleteById("products"));
