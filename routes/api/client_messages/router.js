import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getMessage from "./get.js";

export const router = express.Router();

router.get("", adminAuthorization, getMessage);
router.post("", adminAuthorization, resources.post("client_messages"));
router.put("", adminAuthorization, resources.put("client_messages"));
router.delete("", adminAuthorization, resources.delete("client_messages"));

router.get("/:message_id", adminAuthorization, resources.getById("client_messages", "message_id"));
router.put("/:message_id", adminAuthorization, resources.putById("client_messages", "message_id"));
router.delete("/:message_id", adminAuthorization, resources.deleteById("client_messages", "message_id"));