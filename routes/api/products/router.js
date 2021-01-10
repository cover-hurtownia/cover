import express from "express";

import * as resources from "../resources/index.js";
import getProduct from "./get.js";

export const router = express.Router();

router.get("", getProduct);
router.post("", resources.post("products"));
router.put("", resources.put("products"));
router.delete("", resources.delete("products"));

router.get("/:id", resources.getById("products"));
router.put("/:id", resources.putById("products"));
router.delete("/:id", resources.deleteById("products"));