import express from "express";

import * as resources from "../resources/index.js";
import getProduct from "./get.js";

export const router = express.Router();

router.get("", getProduct);
router.post("", resources.post("products"));
router.put("", resources.put("products"));
router.delete("", resources.delete("products"));

router.get("/:product_id", resources.getById("products", "product_id"));
router.put("/:product_id", resources.putById("products", "product_id"));
router.delete("/:product_id", resources.deleteById("products", "product_id"));