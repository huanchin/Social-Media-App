import express from "express";

import {
  getPosts,
  uploadPostImage,
  createPost,
} from "../controllers/post.controller.js";
import verifySession from "../utils/verifySession.js";

const router = express.Router();

router.get("/", verifySession, getPosts);
router.post("/create", verifySession, uploadPostImage, createPost);

export default router;
