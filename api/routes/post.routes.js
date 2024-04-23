import express from "express";
import { getPosts } from "../controllers/post.controller.js";
import verifySession from "../utils/verifySession.js";

const router = express.Router();

router.get("/", verifySession, getPosts);

export default router;
