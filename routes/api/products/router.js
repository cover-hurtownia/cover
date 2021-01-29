import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getProduct from "./get.js";

export const router = express.Router();

router.get("", getProduct);
router.post("", adminAuthorization, resources.post("products"));
router.put("", adminAuthorization, resources.put("products"));
router.delete("", adminAuthorization, resources.delete("products"));

router.get("/:product_id", resources.getById("products", "product_id"));
router.put("/:product_id", adminAuthorization, resources.putById("products", "product_id"));
router.delete("/:product_id", adminAuthorization, resources.deleteById("products", "product_id"));
