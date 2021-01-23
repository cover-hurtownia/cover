import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getOrder from "./get.js";
import postOrder from "./post.js";
import placeOrder from "./placeOrder.js";

import getOrderById from "./getById.js";
import acceptOrder from "./accept.js";
import sendOrder from "./send.js";
import cancelOrder from "./cancel.js";
import deliveredOrder from "./delivered.js";

export const router = express.Router();

router.get("", adminAuthorization, getOrder);
router.post("", adminAuthorization, postOrder);
router.put("", adminAuthorization, resources.put("orders"));
router.delete("", adminAuthorization, resources.delete("orders"));

router.get("/:order_id", adminAuthorization, getOrderById);
router.post("/:order_id/accept", adminAuthorization, acceptOrder);
router.post("/:order_id/send", adminAuthorization, sendOrder);
router.post("/:order_id/cancel", adminAuthorization, cancelOrder);
router.post("/:order_id/delivered", adminAuthorization, deliveredOrder);
router.post("/place_order", placeOrder);
router.put("/:order_id", adminAuthorization, resources.putById("orders", "order_id"));
router.delete("/:order_id", adminAuthorization, resources.deleteById("orders", "order_id"));