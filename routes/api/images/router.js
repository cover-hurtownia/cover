import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";

import getImage from "./get.js";
import getImageById from "./getById.js";
import postImage from "./post.js";
import putImageById from "./putById.js";

export const router = express.Router();

router.get("", adminAuthorization, getImage);
router.post("", adminAuthorization, postImage);
router.delete("", adminAuthorization, resources.delete("images"));

router.get("/:image_id", adminAuthorization, getImageById);
router.put("/:image_id", adminAuthorization, putImageById);
router.delete("/:image_id", adminAuthorization, resources.deleteById("images", "image_id"));