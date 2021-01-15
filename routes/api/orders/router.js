import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getOrder from "./get.js";
import getOrderById from "./getById.js";

export const router = express.Router();

router.get("", adminAuthorization, getOrder);
router.post("", adminAuthorization, resources.post("orders"));
router.put("", adminAuthorization, resources.put("orders"));
router.delete("", adminAuthorization, resources.delete("orders"));

router.get("/:order_id", adminAuthorization, getOrderById);
router.put("/:order_id", adminAuthorization, resources.putById("orders", "order_id"));
router.delete("/:order_id", adminAuthorization, resources.deleteById("orders", "order_id"));