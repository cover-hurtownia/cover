import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getOrderStatus from "./get.js";

export const router = express.Router();

router.get("", getOrderStatus);
router.post("", adminAuthorization, resources.post("order_status"));
router.put("", adminAuthorization, resources.put("order_status"));
router.delete("", adminAuthorization, resources.delete("order_status"));

router.get("/:order_status_id", resources.getById("order_status"));
router.put("/:order_status_id", adminAuthorization, resources.putById("order_status", "order_status_id"));
router.delete("/:order_status_id", adminAuthorization, resources.deleteById("order_status", "order_status_id"));